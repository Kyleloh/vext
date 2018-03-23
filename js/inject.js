const doneList = [];

let startTime = new Date().getTime();
let timer = null;

function addToCart(size_id, timex) {
    $.ajax({
        url: `https://cart.vip.com/te2/add.php?size_id=${size_id}&num=1&client_time=${timex}&act=&mars_cid=000000`,
        dataType: "jsonp"
    });
}

function detailLoop() {
    $.ajax({
        url: "https://myi.vip.com/fav_sku/goods_detail?sale_status=ON_SALE&count=50&warehouse=VIP_NH&is_old=1",
        dataType: "jsonp"
    }).then(res => {
        if (res.data.on_sale.length != 0) {
            const timex = parseInt(new Date().getTime() / 1000);
            res.data.on_sale.forEach(item => {
                if (doneList.indexOf(item.size_id) == -1) {
                    addToCart(item.size_id, timex);
                    addToCart(item.size_id, timex+1);
                    addToCart(item.size_id, timex+2);
                    doneList.push(item.size_id);
                }
            });
        }
    });
}

// 收藏列表
$.ajax({
    url: `https://myi.vip.com/fav_sku/goods_detail?sale_status=FUTURE&count=50&warehouse=VIP_NH&is_old=1`,
    dataType: "jsonp"
}).then(res=>{
    startTime = _.min(res.data.future.map(item => item.sell_time_from));
    timer = setInterval(()=>{
        if(Math.abs(new Date().getTime() - startTime)<3000){
            detailLoop();
        }else{
            console.log('ticktock');
        }
    },300);
});


