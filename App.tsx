import { StatusBar } from "expo-status-bar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { parse } from "node-html-parser"
import { SafeAreaView } from "react-native-safe-area-context"

const htmlString = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <a href="https://flowerstore.ph/product/wooden-hearts-ornaments">
      Wooden Hearts Ornaments
    </a>
  </body>
</html>
`

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

type Token = {
  type: "LINK" | "FRAGMENT"
  token: string
}

function parseHtmlString(htmlString: string): Token[] {
  const root = parse(htmlString)
  const links = root.querySelectorAll("a").map((el) => el.outerHTML)
  const delimiter = new RegExp(
    `(${links.map((link) => escapeRegExp(link)).join("|")})`
  )

  return htmlString.split(delimiter).map(
    (token) =>
      ({
        type: links.includes(token) ? "LINK" : "FRAGMENT",
        token,
      } as Token)
  )
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Original Text:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{htmlString}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parsed Text:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>
            {parseHtmlString(htmlString).map((token) => {
              if (token.type === "LINK") {
                const el = parse(token.token).querySelector("a")
                return (
                  <Text
                    style={{
                      fontWeight: "700",
                    }}
                    onPress={() => {
                      Alert.alert(
                        "Link Clicked",
                        `You have clicked a link going to: ${el.rawAttributes.href}`
                      )
                    }}
                  >
                    {el.textContent.replaceAll("\n", "").trim()}
                  </Text>
                )
              } else {
                return <Text>{token.token}</Text>
              }
            })}
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: "#444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  codeBlockText: {
    color: "white",
    fontFamily: "monospace",
  },
})
