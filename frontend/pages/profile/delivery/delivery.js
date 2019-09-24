// pages/profile/delivery/delivery.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    isback: 0,
    id: 0,
    showModal1: 0,
    deleteid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.kind == 'beebuy')
    {
      console.log("ok")
      this.data.id = options.id
      this.data.isback = 1
    }
    this.getData();  
  },
  getData: function()
  {
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/getAcceptAddress',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {
        if(res.data.result!=null){
          var temparray = res.data.result
          for(var iter = 0; iter < temparray.length; iter ++)
          {
            temparray[iter].showphone = temparray[iter].phone;
            //temparray[iter].showphone = temparray[iter].phone.slice(0, 3) + "*****" + temparray[iter].phone.slice(8, 11)
          }
          that.setData({
            address: temparray
          });
        }
      },
      fail: function (res) {
      }
    })
  },
  checkMainAddress:function(event){
    var that = this;
    var id=event.currentTarget.id;
    var address_buf=that.data.address;
    var no = address_buf[id].no;
    wx.request({
      url:app.globalData.mainURL+"api/checkAcceptAddress",
      method:'POST',
      header:{
        'content-type':'application/json'
      },
      data:{
        'address_id': no,
        'user_id': app.globalData.userInfo.user_id
      },
      success:function(res){
      }
    })

    for(var index=0; index<address_buf.length; index++)
    {
      if(index==id) 
      {
        address_buf[index].state = 1
      }
      else
      {
        address_buf[index].state = 0
      }
    }
    that.setData({
      address:address_buf
    })
    
  },
  
  on_click_edit: function(e)
  {
    var id = e.currentTarget.id;
    var address = this.data.address[id]
    console.log(address)
    wx.navigateTo({
      url: 'editdelivery?no='+address.no+'&name='+address.name+'&phone='
      + address.phone + '&detail_address=' + address.detail_address + '&province=' + address.province + '&city=' + address.city + '&area=' + address.area + '&email=' + address.email + '&pid=' + address.province_id + '&cid=' + address.city_id + '&aid=' + address.area_id,
    })
  },
  on_click_delete: function(e)
  {
    var that = this;
    that.data.deleteid = e.currentTarget.id;
    this.setData({
      showModal1: true
    });
  },
  on_click_new: function(event){
    var that = this
    if(that.data.isback == 1)
    {
      wx.navigateTo({
        url: 'editdelivery?kind=' + 'edit&id=' + that.data.id
      })
    }
    else{
      wx.navigateTo({
        url: 'editdelivery?no=' + '0'
      })
    }
  },
  onCancel1: function () {
    this.setData({
      showModal1: false
    });
  },
  onConfirm1: function (id) {
    var that = this
    wx.request({
      url: app.globalData.mainURL+'api/deleteAcceptAddress',
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data:{
        'address_id': that.data.deleteid,
        'user_id': app.globalData.userInfo.user_id
      },
      success: function(res)
      {
        if(res.data.status == false)
        {
          that.setData({
            address: []
          })
        }
        else{
          var temparray = res.data.result
          for (var iter = 0; iter < temparray.length; iter++) {
            temparray[iter].showphone = temparray[iter].phone.slice(0, 3) + "*****" + temparray[iter].phone.slice(8, 11)
          }
          that.setData({
            address: temparray
          })
        }
      }
    })
    this.setData({
      showModal1: false
    });
  },
})