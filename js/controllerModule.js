/**
 * Created by Administrator on 2016/06/13.  定义一个服务执行搜索操作，因为有查找、修改、删除成绩均用到了这个操作，另外定义一个指令修改元素样式（均未完成！）。
 */
angular.module("controllerModule",['serviceModule'])
    .controller("homeCtrl", function ($scope) {
       $scope.myData=[
           {"ID":"1501001", "Name":"张三", "Chinese":92, "Math":72, "English":88},
           {"ID":"1501002", "Name":"李四", "Chinese":72, "Math":92, "English":38},
           {"ID":"1501003", "Name":"王刚", "Chinese":88, "Math":92, "English":73},
           {"ID":"1501004", "Name":"周红", "Chinese":96, "Math":59, "English":48},
           {"ID":"1501005", "Name":"郭芳", "Chinese":91, "Math":42, "English":98},
           {"ID":"1501006", "Name":"刘杰", "Chinese":81, "Math":79, "English":63},
           {"ID":"1501007", "Name":"程熙", "Chinese":86, "Math":74, "English":62},
           {"ID":"1501008", "Name":"施明", "Chinese":84, "Math":88, "English":59},
           {"ID":"1501009", "Name":"梁子", "Chinese":76, "Math":81, "English":93},
           {"ID":"1501010", "Name":"陈龙", "Chinese":68, "Math":98, "English":83},
           {"ID":"1501011", "Name":"杨六", "Chinese":66, "Math":25, "English":76}
       ];
        $scope.gridOptions={data:"myData"}
    })
    .controller("loginCtrl", function ($scope,$state) {
        $scope.userName="admin";
        $scope.password="123456";
        $scope.userNameFlag=true;  //用户名不存在标志位，一开始没有输入，空用户名不存在  ,没有成功实现，重新输入用户名使提示信息消失
        $scope.passwordFlag=true;  //密码错误标志位,一开始没有收入所以错误，
        $scope.clickFlag=false;
        $scope.login= function () {
            $scope.clickFlag=true;
            for(var i=0;i<$scope.userInfo.length;i++){
                if($scope.userName==$scope.userInfo[i].userName){
                    $scope.userNameFlag=false;
                    if($scope.password == $scope.userInfo[i].password){
                        $scope.clickFlag=false;
                        $scope.userNameFlag=true;
                        $scope.$parent.currentUser=$scope.userInfo[i].userName;  //要使用$parent获取父作用域中的currentUser后赋值，否则会赋值失败
                        $state.go("^.home");
                    }else {
                        $scope.passwordFlag=true;
                    }
                }
            }
        };
        $scope.$watch("password",function(){
            $scope.passwordFlag=false;
        });
    })
    .controller("registerCtrl", function ($scope,$state) {
        $scope.registerInfo={
            userName:"",
            password:""
        };
        $scope.confirmPW="";
        $scope.register= function () {
            if($scope.confirmPW != $scope.registerInfo.password){
                $scope.tip="确认密码与密码必须相同!";
            }else {
                $scope.tip="";
                $scope.userInfo.push($scope.registerInfo);
                alert("注册成功，请登录！");
                $state.go("content.login");
            }
        };
        $scope.$watch("confirmPW", function (newValue) {
            if(newValue==$scope.registerInfo.password){
                $scope.tip="";
            }
        });
    })
    .controller("contentCtrl", function ($scope,$state) {
        $scope.userInfo=[
            {userName:"admin",password:"123456"}
        ];
        $scope.currentUser="";  //存放当前用户名
    })
    .controller("header2Ctrl", function ($scope,$state) {
        $scope.$on("$viewContentLoaded", function () {
            if($scope.currentUser == ""){   //如果没有登录就直接来到主页面，则强制回调登录页面
                $state.go("content.login");
            }
        });
        $scope.logoff= function () {
            $scope.$parent.currentUser="";
            $state.go("content.login");
        }
    })
    .controller("addScoreCtrl", function ($scope) {
        $scope.infoArray=[{
            "addResult":"待添加",//给用户提示添加的结果，初始显示待添加，单击添加按钮后改变它的值提示该项是否添加成功
            "addFlag":false, //单击添加按钮时使该项为true，以便验证用户输入信息
            "addSuccessFlag":false,
            "idConflictFlag":false,
            "ID":"",
            "Name":"",
            "Chinese":"",
            "Math":"",
            "English":""
        }];
        $scope.addLine= function () {
            $scope.infoArray.push({
                "addResult":"待添加",
                "addFlag":false, //单击添加按钮时使该项为true，以便验证用户输入信息
                "addSuccessFlag":false,
                "idConflictFlag":false,
                "ID":"",
                "Name":"",
                "Chinese":"",
                "Math":"",
                "English":""
            });
        };
        $scope.deleteLine= function (index) {
            $scope.infoArray.splice(index,1);
        };
        $scope.addScore= function () {
            for(var i=0;i<$scope.infoArray.length;i++){
                $scope.infoArray[i].addFlag=true;
                //"判断每组数据的合法性，将合法的数据添加到总分数信息数组"
                if($scope.infoArray[i].ID !== "" && $scope.infoArray[i].Name !== "" && $scope.infoArray[i].Chinese !== "" && $scope.infoArray[i].Math !== "" && $scope.infoArray[i].English !== ""){
                    for(var j=0; j<$scope.myData.length;j++){
                        if($scope.myData[j].ID == $scope.infoArray[i].ID){
                            $scope.infoArray[i].idConflictFlag=true;
                            break;
                        }
                    }
                    if($scope.infoArray[i].idConflictFlag===false) {    //判断当前待添加的学生的id是否与表中已有的学生的id相同，保证id是唯一的
                        $scope.newObject=jQuery.extend({},$scope.infoArray[i]);
                        delete $scope.newObject.addResult;
                        delete $scope.newObject.addFlag;
                        delete $scope.newObject.addSuccessFlag;
                        delete $scope.newObject.idConflictFlag;
                        $scope.myData.push($scope.newObject);
                        $scope.infoArray[i].addResult="添加成功";
                        $scope.infoArray[i].addSuccessFlag=true;
                    }else{//id冲突，提示用户不能添加此项
                        $scope.infoArray[i].addResult="ID冲突";
                        $scope.infoArray[i].addSuccessFlag=false;
                    }
                }else {//输入的学生信息有的项为空，不合法，给非法项设置红色边框提示用户
                    $scope.infoArray[i].addResult="有非法项";
                }
            }
        }
    })
    .controller("searchScoreCtrl", function ($scope,searchService) { //利用表单联动，选择一个查询方式，则显示一个相应的搜索框
        $scope.optionItem="ID"; //设置默认选择项为ID
        $scope.keyword="";
        $scope.searchResult=[];
        $scope.searchFlag={
            "head":false,
            "noResult":false
        };
        $scope.search= function () {
            if($scope.optionItem=="Chinese" || $scope.optionItem=="Math" || $scope.optionItem=="English"){ //将string形式的分数值转换为number形式
                $scope.keyword=parseFloat($scope.keyword);
            }
            var result= searchService.search($scope.optionItem,$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult=result.resultArray;
            $scope.searchFlag.noResult= !result.flag;
            if($scope.searchResult.length>0){  //显示表头信息
                $scope.searchFlag.head=true;
            }
        }
    })
    .controller("deleteScoreCtrl",function($scope,searchService){
        $scope.optionItem="ID"; //设置默认选择项为ID
        $scope.keyword="";
        $scope.searchResult=[];//可能有重名的情况，所以设置为数组形式
        $scope.searchFlag={
            "head":false,
            "noResult":false,
            "clickFlag":false
        };
        $scope.delete= function () {
            $scope.searchResult=[];  //目前只允许一次删除一项
            $scope.searchFlag.noResult=false;
            $scope.searchFlag.clickFlag=true;
            var result= searchService.search($scope.optionItem,$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult = result.resultArray;
            $scope.searchFlag.noResult = !result.flag;
            if($scope.searchResult.length>0){ //显示搜索结果表格的表头
                $scope.searchFlag.head=true;
            }
        };
        $scope.cancel= function () {
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
        };
        $scope.confirmDelete= function () {
            for(var i=0;i<$scope.searchResult.length;i++){
                $scope.myData.splice($scope.searchResult[i].index,1);
            }
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
            alert("删除成功！");
        }
    })
    .controller("modifyScoreCtrl", function ($scope,searchService) {
        $scope.optionItem="ID"; //设置默认选择项为ID
        $scope.keyword="";
        $scope.searchResult=[];//可能有重名的情况，所以设置为数组形式
        $scope.searchFlag={
            "head":false,
            "noResult":false
        };
        $scope.search= function () {
            $scope.searchResult=[];  //目前只允许一次修改一项
            $scope.searchFlag.noResult=false;
            $scope.searchFlag.clickFlag=true;
            var result= searchService.search($scope.optionItem,$scope.keyword,$scope.myData,$scope.searchResult);
            $scope.searchResult = result.resultArray;
            $scope.searchFlag.noResult = !result.flag;
            if($scope.searchResult.length > 0){ //显示搜索结果表格的表头
                $scope.searchFlag.head=true;
            }
        };
        $scope.cancel= function () {
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
        };
        $scope.save= function () {
            //判断是否合法，ID 是否冲入等(考虑使用服务里的方法好了)然后在修改


            for(var i=0;i<$scope.searchResult.length;i++){
                delete $scope.searchResult[i].tipFlag;
                var index =$scope.searchResult[i].index;
                delete $scope.searchResult[i].index;
                delete $scope.searchResult[i].Average;
                $scope.myData.splice(index,1,$scope.searchResult[i]);
            }
            $scope.searchResult=[];
            $scope.searchFlag.head=false;
            $scope.searchFlag.clickFlag=false;
            alert("修改成功!");
        }
    });