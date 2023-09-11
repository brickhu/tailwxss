const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
// const theme = require('tailwindcss/theme')
const https = require('https');

console.log('\x1b[36m%s\x1b[0m','THEMIfy')

const LOCAL_FILE = require('../theme.config.json')
const REMOTE_JSON = 'https://jeeweixin.com/json/weapp/index.json'
const URL_REXG = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/

const getCustomThemeConfig = (url) => new Promise((resolve, reject) => {
  if(typeof(url)==='object'){
    resolve(url) 
    return
  }
  if(URL_REXG.test(url)){
    https.get(url, (response) => {
      let themes = '';
      response.on('data', (chunk) => {
        themes += chunk;
      });
      response.on('end', () => {
        const data = JSON.parse(themes)
        resolve(data)
      });
    
    }).on("error", (error) => {
      console.log("Error: " + error.message);
      reject(null)
    });
  }else{
    reject(null)
  }
})

// getCustomThemeConfig(LOCAL_FILE).then(res=>console.log(res)).catch(err=>console.log('\x1b[36m%s\x1b[0m',err))

// 颜色
const getBrandColors = () => {
  const COLORS = {
    primary: {
      DEFAULT: '#219fd6',
      contrast: '#f1f9fe',
      light: '#12577a',
      thick: '#144866'
    },
    secondary: {
      DEFAULT: '#e64e3d',
      contrast: '#fdf4f3',
      light: '#fcd1cc',
      thick: '#7b2a21'
    },
    danger: {
      DEFAULT: '#f04c4c',
      contrast: '#fef2f2',
      light: '#fecaca',
      thick: '#7f1d1d'
    },
    warning: {
      DEFAULT: '#f2e236',
      contrast: '#402608',
      light: '#f9f88f',
      thick: '#6d4916'
    },
    info: {
      DEFAULT: '#fff000',
      contrast: '#fff000',
      light: '#fff000',
      thick: '#fff000'
    },
    neutral: {
      ...colors.gary
    }
  }
  // 暴露css variables
  const transVariabledColors = (rawColors,pfx='--colors') =>{
    const newColors = {}
    Object.keys(rawColors).forEach((name)=>{
      newColors[name] = {}
      for (const [key, vaule] of Object.entries(rawColors[name])) {
        newColors[name][key] = key=='DEFAULT'?`var(${pfx}-${name},${vaule})`:`var(${pfx}-${name}-${key},${vaule})`
      }
    })
    return newColors
  }
  return transVariabledColors(COLORS)
}


module.exports = plugin.withOptions(function (options = {}) {
  return async function({ addComponents,addBase,theme }) {
    addBase({
      view: {
        color: theme('colors.neutral.800')
      },
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
    })
    addComponents({
      '.btn': {
        lineHeight: '1em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 700,
        gap: 'var(--gp, 0.8em)',
        borderRadius: 'var(--r, 0.5em)',
        boxSizing: 'border-box',
        color: 'var(--c)',
        backgroundColor: 'var(--bg)',
        border: 'var(--bd)',
        '&,&-md': {
          fontSize: theme('fontSize.base'),
          padding: '0.8em 1.6em'
        },
        '&-sm': {
          fontSize: theme('fontSize.sm'),
          padding: '0.7em 1.4em',
          fontWeight: 500
        },
        '&-lg': {
          fontSize: theme('fontSize.lg'),
          padding: '0.8em 1.6em'
        },
        '&-xl': {
          fontSize: theme('fontSize.xl'),
          padding: '1em 2em'
        },
        '&,&-neutral': {
          '--c-bg': theme('colors.neutral.700'),
          '--c-text': theme('colors.neutral.50')
        },
        '&-primary': {
          '--c-bg': theme('colors.primary.DEFAULT'),
          '--c-text': theme('colors.primary.contrast')
        },
        '&-secondary': {
          '--c-bg': theme('colors.secondary.DEFAULT'),
          '--c-text': theme('colors.secondary.contrast')
        },
        '&-danger': {
          '--c-bg': theme('colors.danger.DEFAULT'),
          '--c-text': theme('colors.danger.contrast')
        },
        '&-warning': {
          '--c-bg': theme('colors.warning.DEFAULT'),
          '--c-text': theme('colors.warning.contrast')
        },
        '&-info': {
          '--c-bg': theme('colors.info.DEFAULT'),
          '--c-text': theme('colors.info.contrast')
        },
        '&,&-fill': {
          '--c': 'var(--c-text)',
          '--bg': 'var(--c-bg)',
          '--bd': 'solid 1px var(--c-bg)'
        },
        '&-outline': {
          '--c': 'var(--c-bg)',
          '--bg': 'transparent',
          '--bd': 'solid 1px currentColor'
        },
        '&-text': {
          '--c': 'var(--c-bg)',
          '--bg': 'transparent',
          '--bd': 0
        },
        '&-corner': {
          '--r': 0
        },
        '&-round': {
          '--r': '9999px'
        },
        '&[disabled], &-disabled': {
          backgroundColor: 'white !important',
          border: 'solid 1px white !important',
          '&:after': {
            backgroundColor: 'var(--c-bg)',
            border: 'var(--bd)',
            color: 'red',
            opacity: 0.3
          }
        }
      }
    })
  }
}, function (options) {
  // console.log('options: ', options);
  return {
    theme: {
      extend: {
        colors: getBrandColors(),
        spacing: {
          rpx: '1rpx'
        }
      }
    }
  }
})


