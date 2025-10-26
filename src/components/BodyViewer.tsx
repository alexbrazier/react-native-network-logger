import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useThemedStyles, Theme } from '../theme';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type BodyViewerProps = {
  content?: string;
  data?: JsonValue;
  initiallyExpanded?: boolean;
};

const BodyViewer: React.FC<BodyViewerProps> = ({
  content,
  data,
  initiallyExpanded = true,
}) => {
  const parsed = useMemo(() => {
    if (data !== undefined) return { isJson: true, value: data } as const;
    return parseIfJson(content || '');
  }, [content, data]);

  if (parsed.isJson && parsed.value !== null) {
    return (
      <CollapsibleJsonView
        data={parsed.value}
        initiallyExpanded={initiallyExpanded}
      />
    );
  }

  return <TextViewer>{content || ''}</TextViewer>;
};

export default BodyViewer;

const isObject = (v: JsonValue): v is { [key: string]: JsonValue } =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const isArray = (v: JsonValue): v is JsonValue[] => Array.isArray(v);

const stringifyPrimitive = (value: JsonPrimitive) => {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  return String(value);
};

const ExpandRow: React.FC<{
  name?: string | number;
  level: number;
  open: string;
  close: string;
  expanded: boolean;
  hasChildren: boolean;
  childrenCount: number;
  onToggle: () => void;
  children?: React.ReactNode;
}> = ({
  name,
  level,
  open,
  close,
  expanded,
  hasChildren,
  childrenCount,
  onToggle,
  children,
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View
      style={[
        styles.jsonLevelContainerBase,
        level % 2 === 0 ? styles.jsonLevelEven : styles.jsonLevelOdd,
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        disabled={!hasChildren}
        accessibilityRole="button"
        accessibilityLabel="Expand or collapse section"
        style={[styles.jsonRow, { paddingLeft: level * 12 }]}
      >
        <Text style={[styles.baseText, styles.jsonText]}>
          {hasChildren ? (expanded ? '▼ ' : '▶ ') : ''}
          {name !== undefined ? `${String(name)}: ` : ''}
          <Text style={[styles.baseText, styles.jsonBracket]}>{open}</Text>
          {!expanded ? `${hasChildren ? childrenCount : ''}` : ''}
          {!expanded ? (
            <Text style={[styles.baseText, styles.jsonBracket]}>{close}</Text>
          ) : null}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <>
          {children}
          <Text style={[styles.baseText, styles.jsonText, styles.jsonBracket]}>
            {close}
          </Text>
        </>
      )}
    </View>
  );
};

const JsonNode: React.FC<{
  name?: string | number;
  value: JsonValue;
  level: number;
  initiallyExpanded?: boolean;
}> = ({ name, value, level, initiallyExpanded = false }) => {
  const styles = useThemedStyles(themedStyles);
  const [expanded, setExpanded] = useState(initiallyExpanded);

  if (isObject(value)) {
    const entries = Object.entries(value);
    const open = '{';
    const close = '}';
    const hasLength = entries.length > 0;
    return (
      <ExpandRow
        name={name}
        level={level}
        open={open}
        close={close}
        expanded={expanded}
        hasChildren={hasLength}
        childrenCount={entries.length}
        onToggle={() => setExpanded((e) => !e)}
      >
        {entries.map(([k, v]) => (
          <JsonNode key={k} name={k} value={v} level={level + 1} />
        ))}
      </ExpandRow>
    );
  }

  if (isArray(value)) {
    const open = '[';
    const close = ']';
    const hasLength = value?.length > 0;
    return (
      <ExpandRow
        name={name}
        level={level}
        open={open}
        close={close}
        expanded={expanded}
        hasChildren={!!hasLength}
        childrenCount={value?.length || 0}
        onToggle={() => setExpanded((e) => !e)}
      >
        {value.map((v, idx) => (
          <JsonNode key={idx} name={idx} value={v} level={level + 1} />
        ))}
      </ExpandRow>
    );
  }

  return (
    <View style={[styles.jsonRow, { paddingLeft: level * 12 }]}>
      <Text style={[styles.baseText, styles.jsonText]}>
        {name !== undefined ? `${String(name)}: ` : ''}
        {stringifyPrimitive(value as JsonPrimitive)}
      </Text>
    </View>
  );
};

const CollapsibleJsonView: React.FC<{
  data: JsonValue;
  initiallyExpanded?: boolean;
}> = ({ data, initiallyExpanded = true }) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={[styles.content, styles.textAreaContainer]}>
      <ScrollView nestedScrollEnabled>
        <JsonNode
          level={0}
          value={data}
          initiallyExpanded={initiallyExpanded}
        />
      </ScrollView>
    </View>
  );
};

const parseIfJson = (
  text: string
): { isJson: boolean; value: JsonValue | null } => {
  try {
    const obj = JSON.parse(text);
    return { isJson: true, value: obj };
  } catch {
    return { isJson: false, value: null };
  }
};

const TextViewer: React.FC<{ children: string }> = ({ children }) => {
  const styles = useThemedStyles(themedStyles);

  if (Platform.OS === 'ios') {
    /**
     * A readonly TextInput is used because large Text blocks sometimes don't render on iOS
     * See this issue https://github.com/facebook/react-native/issues/19453
     * Note: Even with the fix mentioned in the comments, text with ~10,000 lines still fails to render
     */
    return (
      <TextInput
        multiline
        editable={false}
        value={children}
        style={[styles.baseText, styles.content, styles.textAreaContainer]}
      />
    );
  }

  return (
    <View style={styles.textAreaContainer}>
      <ScrollView nestedScrollEnabled>
        <Text style={[styles.baseText, styles.content]} selectable>
          {children}
        </Text>
      </ScrollView>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    baseText: {
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
      color: theme.colors.text,
    },
    content: {
      padding: 10,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
    textAreaContainer: {
      maxHeight: 350,
    },
    jsonRow: {
      paddingVertical: 4,
    },
    jsonText: {
      fontSize: 14,
    },
    jsonBracket: {
      paddingStart: 4,
      color: theme.colors.text,
    },
    jsonLevelContainerBase: {
      borderRadius: 4,
      marginVertical: 2,
      paddingBottom: 2,
    },
    jsonLevelEven: {
      backgroundColor: `${theme.colors.card}ff`,
    },
    jsonLevelOdd: {
      backgroundColor: `${theme.colors.background}44`,
    },
  });
