const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
<<<<<<< HEAD
	const {
		resolver: {
			sourceExts,
			assetExts
		}
	} = await getDefaultConfig();

	return {
		transformer: {
			babelTransformerPath: require.resolve("react-native-svg-transformer")
		},
		resolver: {
			assetExts: assetExts.filter(ext => ext !== "svg"),
			sourceExts: [...sourceExts, "svg"]
		}};
=======
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      minifierPath: require.resolve("metro-minify-terser"),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
    },
  };
>>>>>>> upstream/gateway
})();
