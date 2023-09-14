const plugin = require('tailwindcss/plugin')
const { addDynamicIconSelectors } = require('@iconify/tailwind');
const themeMaker = require('./theming/themes-maker')
const components = require('./components.json')



const LIGHT = {
  primary: "#5edbd7",
  secondary: "#7f49bc",
  neutral: "#1c222b",
  ink: '#111828',
}

const DARK = {
  primary: "#bff8ff",
  secondary: "#84af03",
  neutral: "#232f3e",
  ink: '#f3f4f6',
}


// 组件
const brandPlugin = function(options){
  const {variables} = options
  return plugin(function ({ addComponents, theme, addBase }) {
    addBase(Object.assign(variables,{
      button: {
        padding: 0,
        borderRadius: 0,
        border: 0,
        '&::after': {
          padding: 0,
          borderRadius: 0,
          border: 0
        }
      },
      h1: {
        fontSize: theme('fontSize.xl')
      }
    }))
    addComponents(components)
  })
}




// 导出
module.exports = (options)=>{

  const { themes } = options
  const { colors,variables} = themeMaker({themes:themes||null})
  

  return {
    theme: {
      extend: {
        colors: Object.assign(colors,{
          haha: options.haha,
          dede: {
            100: {
              DEFAULT: '#dddddd',
              on: '#000000',
              bg: '#cccccc'
            }
          }
        }),
        spacing: {
          rpx: '1rpx'
        }
      }
    },
    plugins: [brandPlugin({variables}),addDynamicIconSelectors()],
    corePlugins:{
      preflight: false
    }
  }
}

