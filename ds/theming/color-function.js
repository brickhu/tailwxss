const { colord,extend, getFormat } = require('colord')
const mix = require("colord/plugins/mix")
extend([mix]);

const FUNC_COLORS = ['primary','secondary','neutral','error','success','warning','info']

const DEFAULT_THEME = {
  light: {
    primary: "#b48ee2",
    secondary: "#818cf8",
    neutral: "#151e28",
    ink: '#111828',
  },
  dark: {
    primary: "#bff8ff",
    secondary: "#84af03",
    neutral: "#232f3e",
    ink: '#f3f4f6',
  }
}

const DEFAULT_COLORS_HEX = {
  primary: "#b48ee2",
  secondary: "#818cf8",
  neutral: "#151e28",
  ink: '#111827',
}

// 扩展颜色
const extendToFullColors = function(hexObj) {
  const {ink} = hexObj
  const isDark = colord(ink).isDark()
  const bright = colord(ink).brightness()
  const mc = isDark?"#ffffff":"#000000"
  const stp = (bright>0.3&&bright<0.7)?0.04:0.08
  hexObj['s-0'] = colord(mc).invert().toHex()
  hexObj['s0'] = mc
  hexObj['s1'] = colord(ink).mix(mc,1-stp*1).toHex()
  hexObj['s2'] = colord(ink).mix(mc,1-stp*2).toHex()
  hexObj['s3'] = colord(ink).mix(mc,1-stp*3).toHex()
  hexObj['error']  = colord("#FF3030").mix(ink,0.2).toHex()
  hexObj['success']  = colord("#00FF00").mix(ink,0.2).toHex()
  hexObj['warning']  = colord("#FCE300").mix(ink,0.1).toHex()
  hexObj['info']  = colord("#00A2FD").mix(ink,0.2).toHex()
  return hexObj
}

// 将颜色转化带有css变量的值
const transToVariabledColors = (rawColors,pfx='--colors') =>{
  const newColors = {}
  Object.keys(rawColors).forEach((name)=>{
    if(typeof(rawColors[name])=="string") {
      const rgbv = parseHexToRgbValue(rawColors[name])
      newColors[name] = `rgb(var(${pfx}-${name}) / <alpha-value>)`
    }else{
      newColors[name] = {}
      for (const [key, vaule] of Object.entries(rawColors[name])) {
        const rgbv = parseHexToRgbValue(vaule)
        const keyString = key=='DEFAULT'?`${pfx}-${name}`:`${pfx}-${name}-${key}`
        newColors[name][key] = `rgb(var(${keyString}) / <alpha-value>)`
      }
    }
  })
  return newColors
}

const parseHexToRgbValue = (hex) => {
  const rgb =colord(hex).toRgb()
  const {r,g,b} = rgb
  return `${r} ${g} ${b}`
}


const getColors = function(hex=DEFAULT_COLORS_HEX,variabled=true) {
  const fullcolors = extendToFullColors(hex)
  FUNC_COLORS.map(k=>{
    const v = fullcolors[k]
    const isDark = colord(v).isDark()
    fullcolors[k] = {
      DEFAULT: v,
      ink: colord(v).mix(isDark?"#ffffff":"#000000",0.9).toHex(),
      focus: colord(v).mix(isDark?"#ffffff":"#000000",0.1).toHex(),
    }
  })
  return variabled?transToVariabledColors(fullcolors):fullcolors
}

const getColorVariables = function({hex=DEFAULT_COLORS_HEX,pfx='--colors'}) {
  const fullcolors = extendToFullColors(hex)
  FUNC_COLORS.map(k=>{
    const v = fullcolors[k]
    const isDark = colord(v).isDark()
    fullcolors[k] = {
      DEFAULT: v,
      ink: colord(v).mix(isDark?"#ffffff":"#000000",0.9).toHex(),
      focus: colord(v).mix(isDark?"#ffffff":"#000000",0.1).toHex(),
    }
  })
  // const colorObj = getColors(hex,false)
  const variables = {}
  for (const [key, vaule] of Object.entries(fullcolors)) {
    if(typeof(vaule)==='string'){
      variables[`${pfx}-${key}`] = parseHexToRgbValue(vaule)
    }else if(typeof(vaule)==='object'){
      Object.keys(vaule).map(sub=>{
        const k = sub=='DEFAULT'?`${pfx}-${key}`:`${pfx}-${key}-${sub}`
        variables[k] = parseHexToRgbValue(vaule[sub])
      })
    }
  }
  return variables
}

module.exports = {
  getColors,
  getColorVariables
}

