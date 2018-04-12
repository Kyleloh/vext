
const doneList = [];

let startTime = new Date().getTime();
let goodsList = [];
let timer = null;

function addToCart(size_id, timex) {
    $.ajax({
        url: `https://cart.vip.com/te2/add.php?size_id=${size_id}&num=1&client_time=${timex}&act=&mars_cid=000000`,
        dataType: "jsonp"
    }).then(res => {
        if(res.code == 200){
            console.log('[抢购成功!]')
        }
    })
}

// 收藏列表
$.ajax({
    url: `https://myi.vip.com/fav_sku/goods_detail?sale_status=FUTURE&count=50&warehouse=VIP_NH&is_old=1`,
    dataType: "jsonp"
}).then(res=>{
    if(res.data.future.length == 0){
        console.log('>> 收藏列表为空 >>');
        return;
    }
    startTime = _.min(res.data.future.map(item => item.sell_time_from));
    goodsList = res.data.future.filter(item => Math.abs(item.sell_time_from - startTime) < 3000).map(item => item.size_id);
    console.log('开始时间>>', new Date(startTime));
    console.log('准备商品>>', goodsList);

    timer = setInterval(()=>{
        if(Math.abs(new Date().getTime() - startTime)<1000){
            const timex = parseInt(new Date().getTime() / 1000);
            goodsList.forEach(item => {
                addToCart(item, timex);
            });
        }
    },50);

});


