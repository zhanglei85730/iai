
IndexLoading=function(){
    return {
        createDom:function(){
            var div = document.createElement('div');
            div.setAttribute('class','index-loading')
            div.setAttribute('id','indexLoading')
            
            var child01 = document.createElement('div');
            child01.setAttribute('class','loadding-inner');

            var child02 = document.createElement('div');
            child02.setAttribute('class','loadding-main');
            child01.appendChild(child02)

            var child03 = document.createElement('div');
            child03.setAttribute('class','loadding-inner-text');
            child03.innerHTML="即将进入AI智能盯盘"
            child01.appendChild(child03)

            div.appendChild(child01)
            document.body.appendChild(div);
        }
    }
}
IndexLoading().createDom()
