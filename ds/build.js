const fs = require('fs')
const {resolve} = require('path')
const postcss = require('postcss')
const postcssJs = require('postcss-js')
const tailwindcss = require('tailwindcss')

const tansCssToJSOM = function(arr){
  for (const {input,output} of arr) {
    const file = fs.readFileSync(resolve(__dirname,input),'utf8')
    postcss([tailwindcss])
      .process(file, {from: input})
      .then(({css,map})=>{
        const cssJs = postcssJs.objectify(postcss.parse(css))
        fs.writeFile(resolve(__dirname,output), JSON.stringify(cssJs), () => true)
        console.log(`√ - ${input} > ${output}`)
      })
  }
}

tansCssToJSOM([
  {
    input: 'components/index.css',
    output: 'components.json'
  }
])

