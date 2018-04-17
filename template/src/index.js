/* globals alert */
const {{lowerCamelCaseName}} = {
  show() {
      alert("Module {{lowerCamelCaseName}} is created sucessfully ")
  }
};


const meta = {
   {{lowerCamelCaseName}}: [{
    lowerCamelCaseName: 'show',
    args: []
  }]
};

function init(weex) {
  weex.registerModule('{{lowerCamelCaseName}}', {{lowerCamelCaseName}}, meta);
}

export default {
  init:init
}