import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES, SHADOWS } from "../constants";

const styles = StyleSheet.create({
  // Global
  spaceDown: {
    marginBottom: 50,
  },
  safeSpace: {
    flex: 1,
    flexDirection: "column",
    marginTop: 15,
    paddingTop: 10,
  },
  // Welcome
  welcome: {
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: SIZES.large,
    color: COLORS.black,
    fontFamily: FONT.bold,
    marginBottom: 10,
    marginTop: 25,
  },
  welcomemsg: {
    alignSelf: "center",
    fontSize: SIZES.large,
    color: COLORS.black,
    fontStyle: "italic",
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  churchName: {
    alignSelf: "center",
    fontSize: SIZES.xxLarge,
    color: COLORS.black,
    fontFamily: FONT.bold,
    alignItems: "center",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  //   Buttons
  likeBtn: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "#F37453",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  likeBtnImage: {
    width: "40%",
    height: "40%",
    tintColor: "#F37453",
  },
  btnContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  btnBtn: (bgColor) => ({
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginLeft: SIZES.medium,
    borderRadius: SIZES.medium,
    backgroundColor: bgColor,
  }),
  btnText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },

  // Text Inputs
  textContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 10,
    // marginTop: SIZES.large,
    // width: "90%",
    // // height: 20,
  },
  textWrapper: {
    backgroundColor: COLORS.gray2,
    // margin: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: 45,
  },
  textInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: COLORS.black,
    paddingHorizontal: SIZES.medium,
  },

  // Home Styles
  homecontainer: {
    paddingHorizontal: 10,
  },
  homeheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  homeheaderTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  homeheaderBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  homecardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },

  // Home Search
  searchcontainer: {
    width: "100%",
    backgroundColor: COLORS.gray,
    paddingTop: 15,
    paddingBottom: 25,
  },

  searchwelcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
    // marginVertical: 10,
  },
  searchsearchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
  },
  searchsearchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  searchsearchInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
    color: COLORS.black,
  },
  searchsearchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  searchsearchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
  // Home Send Comments
  commentcontainer: {
    width: "100%",
    backgroundColor: COLORS.gray,
    paddingTop: 15,
    paddingBottom: 25,
  },

  commentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
  },
  commentWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  commentInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
    color: COLORS.black,
  },
  commentBtnLike: {
    width: 50,
    height: "100%",
    backgroundColor: "#aa9999",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  commentBtnUpload: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  commentBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },

  // Scripture Card
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  logoContainer: {
    width: 120,
    height: 150,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  scriptureName: {
    fontSize: SIZES.medium,
    fontFamily: "DMBold",
    color: COLORS.primary,
  },
  scriptureSummary: {
    fontSize: SIZES.small + 2,
    fontFamily: "DMRegular",
    color: COLORS.gray,
    marginTop: 3,
    textTransform: "capitalize",
  },
  descscriptureSummary: {
    fontSize: SIZES.xLarge,
    fontFamily: "DMBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  descscriptureDesc: {
    fontSize: SIZES.large,
    textAlign: "left",
  },
  scriptureComment: {
    fontSize: SIZES.small + 2,
    fontFamily: "DMBold",
    color: "#fff574",
    marginTop: 3,
    textTransform: "capitalize",
  },
  scriptureLike: {
    fontSize: SIZES.small + 2,
    fontFamily: "DMRegular",
    color: "#fb4141",
    marginTop: 3,
    textTransform: "capitalize",
  },

  //Tabs
  tabcontainer: {
    // marginTop: SIZES.small,
    // marginBottom: SIZES.small / 2,
  },
  tabbtn: (name, activeTab) => ({
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    backgroundColor: name === activeTab ? COLORS.primary : "#F3F4F8",
    borderRadius: SIZES.medium,
    marginLeft: 2,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  tabbtnText: (name, activeTab) => ({
    fontFamily: "DMMedium",
    fontSize: SIZES.small,
    color: name === activeTab ? "#C3BFCC" : "#AAA9B8",
  }),
  commentName: {
    fontSize: SIZES.medium,
    fontFamily: "DMBold",
    color: COLORS.primary,
  },
  commentComment: {
    fontSize: SIZES.medium,
    fontFamily: "DMRegular",
    color: COLORS.black,
    marginTop: 3,
  },
  commentImageContainer: {
    width: 90,
    height: 110,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  commentImage: {
    width: "100%",
    height: "100%",
  },

  userName: {
    fontSize: SIZES.large,
    fontFamily: "DMBold",
    color: COLORS.primary,
  },
  userImage: {
    marginTop: 25,
    marginBottom: 10,
    height: 150,
    width: 150,
    alignSelf: "center",
    borderRadius: 100,
  },
  userBody: {
    fontSize: SIZES.medium + 2,
    fontFamily: "DMRegular",
    color: COLORS.gray,
    marginTop: 3,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  btnBtnLink: {
    // height: 40,
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    borderRadius: 30,
    width: "80%",
    paddingVertical: 20,
  },
  btnLinkText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: SIZES.medium,
    fontFamily: FONT.bold,
    paddingVertical: 20,
  },
  youtubeText: {
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: SIZES.large,
    color: COLORS.black,
    fontFamily: FONT.bold,
    marginBottom: 10,
    marginTop: 25,
  },
});

export default styles;
