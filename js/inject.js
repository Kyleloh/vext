
const doneList = [];

let startTime = new Date().getTime();
let goodsList = [];
let timer = null;
let useBatch = true;

function addToCart(size_id) {
    const timex = parseInt(new Date().getTime() / 1000);
    $.ajax({
        url: `https://cart.vip.com/te2/add.php?size_id=${size_id}&num=1&client_time=${timex}&act=&mars_cid=000000`,
        dataType: "jsonp"
    }).then(res => {
        if (res.code == 200) {
            console.log('[抢购成功!]')
        }
    })
}

function addBatchToCart(goodsList) {
    const timex = parseInt(new Date().getTime() / 1000);
    $.ajax({
        url: `https://cart.vip.com/te2/add.php?&client_time=${timex}&act=mul&mars_cid=000000${goodsList.map(item => `&size_id[]=${item}`).join('')}${goodsList.map(() => '&num[]=1')}`,
        dataType: "jsonp"
    }).then(res => {
        if (res.success == 200 && res.success.length > 0) {
            console.log('[抢购成功!]')
        }
    })
}

// 收藏列表
$.ajax({
    url: `https://myi.vip.com/fav_sku/goods_detail?sale_status=FUTURE&count=50&warehouse=VIP_NH&is_old=1`,
    dataType: "jsonp"
}).then(res => {
    if (res.data.future.length == 0) {
        console.log('>> 收藏列表为空 >>');
        return;
    }
    startTime = res.data.future.map(item => item.sell_time_from).reduce((a,b)=>Math.min(a,b));
    goodsList = res.data.future.filter(item => Math.abs(item.sell_time_from - startTime) < 3000).map(item => item.size_id);
    console.log('开始时间>>', new Date(startTime));
    console.log('准备商品>>', goodsList);

    if (useBatch) {
        // 批量接口
        console.log('批量接口')
        timer = setInterval(() => {
            if (new Date().getTime() - startTime > -240) {
                let timer2 = setInterval(() => {
                    if (new Date().getTime() - startTime > 0) {
                        clearInterval(timer2);
                        console.log('本轮结束')
                    }
                    console.log('【addBatchToCart】');
                    addBatchToCart(goodsList)

                }, 30);
                clearInterval(timer);
            }
        }, 10);
    } else {
        // 单个接口
        console.log('单个接口')
        timer = setInterval(() => {
            if (new Date().getTime() - startTime > -1000) {
                let timer2 = setInterval(() => {
                    if (new Date().getTime() - startTime > 0) {
                        clearInterval(timer2);
                        console.log('本轮结束')
                    }

                    goodsList.forEach(item => {
                        addToCart(item);
                    });

                }, 240);
                clearInterval(timer);
            }
        }, 10);
    }



});



