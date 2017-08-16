const extend = require("js-base/core/extend");
const Router = require("sf-core/ui/router");
const ListViewItem = require("sf-core/ui/listviewitem");
const ListViewTemplate = require("../components/ListviewTemplate");
const Color = require("sf-core/ui/color");
const Dialog = require("sf-core/ui/dialog");
const ActivityIndicator = require('sf-core/ui/activityindicator');
const FlexLayout = require('sf-core/ui/flexlayout');
const Http = require("sf-core/net/http");
const Timer = require("sf-core/timer");
const AlertUtil = require("sf-extension-utils/alert");
const StatusBarStyle = require('sf-core/ui/statusbarstyle');

// Get generetad UI code
var Page1Design = require("../ui/ui_page1");
var _superOnShow, _superOnLoad;
var loadingDialog;
var bilyonerData;

const Page1 = extend(Page1Design)(
    function(_super) {
        var self = this;
        _superOnShow = this.onShow;
        _superOnLoad = this.onLoad;
        
        _super(self, {
            onShow: onShow.bind(this),
            onLoad: onLoad.bind(this),
        });
        
        this.listView.itemCount = 0;
        initListView(this);
    }
);

function onLoad(){
     showLoadingDialog();
    _superOnLoad && _superOnLoad();
}

function onShow(argument) {
    _superOnShow && _superOnShow();
    
    var page = this;
    page.headerBar.backgroundColor = Color.create(47,98,14);
    page.headerBar.title = "Bilyoner.com";
    page.headerBar.titleColor = Color.WHITE;
    page.statusBar.ios.style = StatusBarStyle.LIGHTCONTENT;
    
    Timer.setTimeout({
        task: function(){
            loadData(page);
        },
        delay: 200 
    });
}

function showLoadingDialog(){
    if(loadingDialog){
        loadingDialog.show();
        return;
    }
    
    loadingDialog = new Dialog();
    var myActivityIndicator = new ActivityIndicator({
        alignSelf: FlexLayout.AlignSelf.CENTER
    });
    loadingDialog.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
    loadingDialog.layout.backgroundColor = Color.create(155,0,0,0);
    loadingDialog.layout.addChild(myActivityIndicator);
    loadingDialog.layout.applyLayout();
    loadingDialog.show();
}

function dismissLoadingDialog(){
    if(loadingDialog){
        loadingDialog.hide();
    }
}

function initListView(page){
    var selectedData = {};
    page.listView.refreshEnabled = false;
    page.listView.rowHeight = 85;
    page.listView.onRowCreate = function(){
        var myListViewItem = new ListViewItem();
        
        var listViewTemplate = new ListViewTemplate();
        listViewTemplate.id = 200;
        myListViewItem.addChild(listViewTemplate);
        
        listViewTemplate.bet_1.borderRadius = 8;
        listViewTemplate.bet_1.ios.masksToBounds = false;
        listViewTemplate.bet_x.borderRadius = 8;
        listViewTemplate.bet_x.ios.masksToBounds = false;
        listViewTemplate.bet_2.borderRadius = 8;
        listViewTemplate.bet_2.ios.masksToBounds = false;
        listViewTemplate.layout_league2.ios.masksToBounds = false;
        
        return myListViewItem;
    };
    page.listView.onRowBind = function(listViewItem, index){
        listViewItem.findChildById(200).setData(page.listView,bilyonerData.gameList[index],selectedData,index);
    };
    page.listView.onPullRefresh = function() {
        // body...
    };
}

function loadData(page){
  
    Http.request({
            'url':'https://www.bilyoner.com/gamelist/games?sports=1',
            // 'headers': {
            // },
            'method':'GET',
            // 'body': '',
        }, function(response){
            // Handling image request response 
            // AlertUtil.showAlert(response.body.toString());
            bilyonerData = JSON.parse(response.body.toString());
            bilyonerData.gameList = bilyonerData.gameList.concat(bilyonerData.gameList);
            bilyonerData.gameList = bilyonerData.gameList.concat(bilyonerData.gameList);
            page.listView.itemCount = bilyonerData.gameList.length;
            page.listView.refreshData();
            dismissLoadingDialog();
        }, function(e){
            // Handle error like:
            dismissLoadingDialog();
            if(e.statusCode === 500){
                AlertUtil.showAlert("Internal Server Error Occurred.");
            }
            else{
                AlertUtil.showAlert("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
            }
        }
    );
}

module && (module.exports = Page1);