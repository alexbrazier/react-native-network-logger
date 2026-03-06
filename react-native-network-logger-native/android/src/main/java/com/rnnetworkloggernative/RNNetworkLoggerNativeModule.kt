package com.rnnetworkloggernative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.network.CustomClientBuilder
import com.facebook.react.modules.network.NetworkingModule
import java.io.IOException
import java.util.UUID
import okhttp3.Interceptor
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.Response
import okio.Buffer

class RNNetworkLoggerNativeModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  companion object {
    private const val MODULE_NAME = "RNNetworkLoggerNativeTransport"
    private const val MAX_BODY_BYTES = 1024L * 64L

    private var isRunning = false
    private var interceptor: RNNetworkLoggerInterceptor? = null

    private fun toUtf8Body(body: RequestBody?): String {
      if (body == null) return ""
      return try {
        val buffer = Buffer()
        body.writeTo(buffer)
        val size = buffer.size
        if (size > MAX_BODY_BYTES) {
          val clipped = buffer.readUtf8(MAX_BODY_BYTES)
          "$clipped... [truncated]"
        } else {
          buffer.readUtf8()
        }
      } catch (_: Exception) {
        ""
      }
    }

    private fun toUtf8ResponseBody(response: Response): String {
      val body = response.body ?: return ""
      return try {
        val peeked = response.peekBody(MAX_BODY_BYTES)
        peeked.string()
      } catch (_: Exception) {
        ""
      }
    }

    private fun contentType(mediaType: MediaType?): String {
      return mediaType?.toString() ?: ""
    }

    private fun responseHeaders(response: Response): WritableMap {
      val map = Arguments.createMap()
      for ((name, value) in response.headers) {
        map.putString(name, value)
      }
      return map
    }

    private fun requestHeaders(chainRequest: okhttp3.Request, requestId: String) {
      val headers = chainRequest.headers
      for (index in 0 until headers.size) {
        val headerName = headers.name(index)
        val headerValue = headers.value(index)
        emit(
            "networkLoggerRequestHeader",
            Arguments.createMap().apply {
              putString("id", requestId)
              putString("header", headerName)
              putString("value", headerValue)
            },
        )
      }
    }

    private fun emit(event: String, payload: WritableMap) {
      val emitter = currentEmitter ?: return
      if (!emitter.reactApplicationContext.hasActiveCatalystInstance()) return
      emitter.reactApplicationContext
          .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit(event, payload)
    }

    private var currentEmitter: RNNetworkLoggerNativeModule? = null
  }

  private class RNNetworkLoggerInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
      val request = chain.request()
      val requestId = UUID.randomUUID().toString()

      emit(
          "networkLoggerRequestOpen",
          Arguments.createMap().apply {
            putString("id", requestId)
            putString("method", request.method)
            putString("url", request.url.toString())
          },
      )

      requestHeaders(request, requestId)

      emit(
          "networkLoggerRequestSend",
          Arguments.createMap().apply {
            putString("id", requestId)
            putString("body", toUtf8Body(request.body))
          },
      )

      return try {
        val response = chain.proceed(request)

        emit(
            "networkLoggerResponseHeaders",
            Arguments.createMap().apply {
              putString("id", requestId)
              putString("contentType", contentType(response.body?.contentType()))
              putDouble("responseSize", response.body?.contentLength()?.coerceAtLeast(0)?.toDouble() ?: 0.0)
              putMap("responseHeaders", responseHeaders(response))
            },
        )

        emit(
            "networkLoggerResponse",
            Arguments.createMap().apply {
              putString("id", requestId)
              putInt("status", response.code)
              putInt("timeout", 0)
              putString("response", toUtf8ResponseBody(response))
              putString("responseURL", response.request.url.toString())
              putString("responseType", "text")
            },
        )

        response
      } catch (error: IOException) {
        emit(
            "networkLoggerResponse",
            Arguments.createMap().apply {
              putString("id", requestId)
              putInt("status", 0)
              putInt("timeout", 0)
              putString("response", error.message ?: "")
              putString("responseURL", request.url.toString())
              putString("responseType", "text")
            },
        )
        throw error
      }
    }
  }

  override fun getName(): String {
    return MODULE_NAME
  }

  override fun initialize() {
    super.initialize()
    currentEmitter = this
  }

  override fun invalidate() {
    if (currentEmitter === this) {
      currentEmitter = null
    }
    super.invalidate()
  }

  @ReactMethod
  fun start() {
    if (isRunning) return

    interceptor = RNNetworkLoggerInterceptor()
    NetworkingModule.setCustomClientBuilder(
        CustomClientBuilder { builder: OkHttpClient.Builder ->
          interceptor?.let { builder.addNetworkInterceptor(it) }
        },
    )
    isRunning = true
  }

  @ReactMethod
  fun stop() {
    if (!isRunning) return
    NetworkingModule.setCustomClientBuilder(null)
    interceptor = null
    isRunning = false
  }

  @ReactMethod
  fun makeNativeTestRequest(url: String) {
    val client = OkHttpClient()
    val request = okhttp3.Request.Builder().url(url).build()
    client.newCall(request).enqueue(
        object : okhttp3.Callback {
          override fun onFailure(call: okhttp3.Call, e: IOException) {
            // no-op; this endpoint is only for validating interception.
          }

          override fun onResponse(call: okhttp3.Call, response: Response) {
            response.close()
          }
        },
    )
  }
}
