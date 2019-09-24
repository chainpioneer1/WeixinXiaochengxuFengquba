const app = getApp()

Page({
    onLoad: function(option) {
        if (option.closeFlag == 'true') {
            wx.navigateBack({ delta: 1 });
            return;
        }
    },
})