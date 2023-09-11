const { colord,extend } = require('colord')
const a11y = require("colord/plugins/a11y");
extend([a11y]);

const DEFAULT_COLORS_HEX = {
  primary: "#b48ee2",
  secondary: "#818cf8",
  neutral: "#151e28",
  error: '#418ce1',
  success: '#26a659',
  warning:'#f0c756',
  info: '#418ce1',
  s1: '#fdfdfd',
}

const TEST_COLOR = "#aabbcc"

// 扩展颜色
const extendToFullColors = function(hexObj) {
  const {s1} = hexObj
  const sInvert = colord(s1).invert().toHex()

  hexObj['s2'] = colord(s1).darken(0.1).toHex()
  hexObj['s3'] = colord(s1).darken(0.2).toHex()
  hexObj['s-on'] = colord(s1).invert().toHex()
  // console.log(colord("#ffffff").contrast("#333333"))
  return hexObj
}

const generateColorObject = function({hex,invert=true}){
  if(invert){
    return {
      DEFAULT: colord(hex).toHsl(),
      on: colord(hex).invert().toHsl()
    }
  }else{
    return colord(hex).toHsl()
  }
  
}

// const 
console.log(extendToFullColors(DEFAULT_COLORS_HEX ))

// console.log(generateColorObject({hex:TEST_COLOR,invert:false}))

module.exports = {
  
}