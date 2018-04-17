const scenarios = [
  'full', 
  'full-karma-airbnb', 
  'minimal'
]

const index = scenarios.indexOf(process.env.WEEX_TEMPL_TEST)

const isTest = exports.isTest = index !== -1

const scenario = isTest && require(`./${scenarios[index]}.json`)

exports.transformBeforeRending = (metalsmith, options, helpers) => {
  if (isTest) {
    Object.assign(
      metalsmith.metadata(),
      { isNotTest: !isTest },
      isTest ? scenario : {}
    )
  }
  else {
    let projectName = metalsmith.metadata().destDirName;
    let iOSProjectName = projectName
    let AndroidProjectName = projectName
    let lowerCamelCaseName = projectName;
    let upperCamelCaseName = projectName;
    if(/-/ig.test(projectName)){
      lowerCamelCaseName = projectName.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
      });
      iOSProjectName =  lowerCamelCaseName.charAt(0).toUpperCase() + lowerCamelCaseName.slice(1);
      AndroidProjectName = lowerCamelCaseName.toLowerCase();
    }
    upperCamelCaseName = lowerCamelCaseName.charAt(0).toUpperCase() + lowerCamelCaseName.slice(1);
    iOSProjectName = upperCamelCaseName;

    Object.assign(
      metalsmith.metadata(),
      { isNotTest: !isTest },
      {
        iOSProjectName: iOSProjectName,
        AndroidProjectName: AndroidProjectName,
        lowerCamelCaseName: lowerCamelCaseName,
        upperCamelCaseName: upperCamelCaseName
      }
    )
  }
}