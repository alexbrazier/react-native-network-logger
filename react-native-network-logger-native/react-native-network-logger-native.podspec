require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-network-logger-native'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.homepage     = package['homepage']
  s.author       = package['author']
  s.platforms    = { :ios => '13.4' }
  s.source       = { :git => package['repository']['url'], :tag => "v#{s.version}" }
  s.source_files = 'ios/**/*.{h,m,mm}'
  s.requires_arc = true

  s.dependency 'React-Core'
end
