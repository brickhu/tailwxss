const { colord,extend, getFormat } = require('colord')
const mix = require("colord/plugins/mix")
extend([mix]);

let colors = {}
const ink = "#E8E7E7"
const isDark = colord(ink).isDark()
if(isDark){
  let tints = []
  tints = colord(ink).tints(10).map(c=>c.toHex())
  colors['s0'] = '#ffffff'
  colors['s1'] = tints[8]
  colors['s2'] = tints[7]
  colors['s3'] = tints[6]
}else{
  let shades = []
  shades = colord(ink).shades(10).map(c=>c.toHex())
  colors['s0'] = '#ffffff'
  colors['s1'] = shades[6]
  colors['s2'] = shades[7]
  colors['s3'] = shades[8]
}

console.log(ink,colors)