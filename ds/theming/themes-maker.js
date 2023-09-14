const { colord,extend, getFormat } = require('colord')
const mix = require("colord/plugins/mix")
extend([mix]);

const BASE_COLORS = ['ink','s-0','s0','s1','s2','s3']
const FUCTIONAL_COLORS = ['error','success','warning','info']
const BRAND_COLORS = ['primary','neutral','secondary']
const SUB_COLORS = ['DEFAULT','ink','focus']

const DEFAULT_THEMES = {
  light: {
    primary: "#5edbd7",
    secondary: "#7f49bc",
    neutral: "#1c222b",
    ink: '#111828',
  },
  dark: {
    primary: "#bff8ff",
    secondary: "#84af03",
    neutral: "#232f3e",
    ink: '#f0e8f3',
  }
}

const transColorValue = (name) => {
  return `rgb(var(--colors-${name}) / <alpha-value>)`
}

const parseHexToRgbValue = (hex) => {
  const rgb =colord(hex).toRgb()
  const {r,g,b} = rgb
  return `${r} ${g} ${b}`
}

// 扩展颜色
const extendFullColors = function(hexObj) {
  const {ink} = hexObj
  const isDark = colord(ink).isDark()
  const bright = colord(ink).brightness()
  // const mc = isDark?"#ffffff":"#000000"
  const stp = (bright>0.3&&bright<0.7)?12:18
  if(isDark){
    let tints = []
    tints = colord(ink).tints(stp).map(c=>c.toHex())
    hexObj['s1'] = hexObj['s1']||tints[stp-2]
    hexObj['s2'] = hexObj['s2']||tints[stp-3]
    hexObj['s3'] = hexObj['s3']||tints[stp-4]
  }else{
    let shades = []
    shades = colord(ink).shades(stp).map(c=>c.toHex())
    hexObj['s1'] = shades[stp-4]
    hexObj['s2'] = shades[stp-3]
    hexObj['s3'] = shades[stp-2]
  }
  
  hexObj['s-0'] = isDark?"#000000":"#ffffff"
  hexObj['s0'] = isDark?"#ffffff":"#000000"
  hexObj['error']  = hexObj['error']||colord("#FF3030").mix(ink,0.2).toHex()
  hexObj['success']  = hexObj['success']||colord("#00FF00").mix(ink,0.2).toHex()
  hexObj['warning']  = hexObj['warning']||colord("#FCE300").mix(ink,0.1).toHex()
  hexObj['info']  = hexObj['info']||colord("#00A2FD").mix(ink,0.2).toHex()

  for (let key in hexObj) {
    if(BASE_COLORS.indexOf(key)<=-1){
      const v = hexObj[key]
      const isDark = colord(v).isDark()
      hexObj[key]= {
        DEFAULT: v,
        ink: colord(v).mix(isDark?"#ffffff":"#000000",0.9).toHex(),
        focus: colord(v).mix(isDark?"#ffffff":"#000000",0.1).toHex()
      }
    }
  }

  return hexObj
}


const getColorVariables = function({fullcolors,pfx='--colors'}) {
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

module.exports = function({themes}) {
  const hexColors = {}

  if(themes&&themes.length>=1){
    themes = themes.map(i=>{
      if(typeof(i)==='string'){
        return DEFAULT_THEMES[i]?{[`${i}`]:DEFAULT_THEMES[i]}:null
      }else if(typeof(i)==='object'){
        return i
      }
    })
    themes = themes.filter(d=>d)
  }else{
    themes = Object.keys(DEFAULT_THEMES).map(i=>{return {[`${i}`]:DEFAULT_THEMES[i]}})
  }
  
  for (let key in Object.assign(...themes)) {
    hexColors[key] = extendFullColors(Object.assign(...themes)[key])
  }


  return {
    variables: (function(){
      const varis = {}
      for(let [index,key] of Object.keys(hexColors).entries()){
        varis[index==0?`page,:root,[data-theme=${key}]`:`[data-theme=${key}]`] = getColorVariables({fullcolors:hexColors[key]})
      }
      return varis
    }()),
    extends: hexColors,
    colors: Object.assign(
      ...BASE_COLORS.map(i=>{return {[i]:transColorValue(i)}}),
      ...[...BRAND_COLORS,...FUCTIONAL_COLORS].map(i=>{return {
        [i]:{
          DEFAULT:transColorValue(i),
          ink: transColorValue(i+'-ink'),
          focus: transColorValue(i+'-focus')
        }
      }})
    )
  }
}