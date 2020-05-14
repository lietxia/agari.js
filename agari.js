function str2hai(str) {
    //1123m1p=>Array(52)[2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    var hai_type;
    var hai_arr = Array(52).fill(0);
    var off = { "m": -1, "p": 10, "s": 21 };
    var arr = str.split("");
    for (var i = arr.length; i--;) {
        var str1 = arr[i];
        if (str1 == "m" || str1 == "p" || str1 == "s" || str1 == "z") {
            hai_type = str1;
        } else {
            var str1 = parseInt(str1);
            if (hai_type == "z") {
                hai_arr[str1 * 3 + 30]++;
            } else {
                hai_arr[str1 + off[hai_type]]++;
            }
        }
    }
    return hai_arr;
}
function hai2str(agariarr) {
    if (agariarr === false) { return '没有和牌，或者不是14张'; }
    var i = 0;
    var normal = true;
    var str = "一般形\n";
    if (agariarr[0] == "chiitoi") {
        str = "七对子\n";
        normal = false;
        i = 1;
    }
    if (agariarr[0] == "kokushi") {
        str = "国士无双\n";
        normal = false;
        i = 1;
    }
    var dic = [
        "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", 0, 0,
        "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", 0, 0,
        "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", 0, 0,
        "1z", 0, 0, "2z", 0, 0, "3z", 0, 0, "4z", 0, 0, "5z", 0, 0, "6z", 0, 0, "7z",
    ];
    for (; i < agariarr.length; i++) {
        var agari = agariarr[i];
        for (var j = 0; j < agari.length; j++) {
            if (normal && (j + 2) % 3 == 0) { str += " "; }
            str += dic[agari[j]];
        }
        str += "\n";
    }
    return str;
}

function agari(hai14_arr) {
    /**
     * 是否和牌
     * 1m ~ 9m =>  0 ~ 8
     * 1p ~ 9p => 11 ~ 19
     * 1s ~ 9s => 22 ~ 30
     * 東 = 33, 南 = 36, 西 = 39, 北 = 42
     * 白 = 45, 發 = 48, 中 = 51
     * 1m1m2m3m1p=>[2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
     * return false => 没有和
     * return 7 => 七对子
     * return 13 => 国士无双
     */
    var kokushi = true;//是否国士无双
    var kokushi_atama_c = 0;
    var kokushi_atama;
    var kokushi_keys = [0, 8, 11, 19, 22, 30, 33, 36, 39, 42, 45, 48, 51];
    for (var i = kokushi_keys.length; i--;) {
        var yaojiu = hai14_arr[kokushi_keys[i]];
        if (yaojiu == 0) {
            kokushi = false;
        }
        if (yaojiu == 2) {
            kokushi_atama_c++;
            kokushi_atama = kokushi_keys[i]
        }
    }
    if (kokushi && kokushi_atama_c === 1) {
        kokushi_keys.push(kokushi_atama);
        return ["kokushi", kokushi_keys];
    }

    var atama_arr = [];//雀头数组
    var hai_count = 0;//牌数量
    var hai1_idx = 0;//第1张牌索引
    var hai2_idx = 0;//第2张牌索引
    var hai13_idx = 51;//第13张牌索引
    var hai14_idx = 51;//第14张牌索引
    var search14 = true;
    var search13 = true;
    //找雀头，放到atama_arr
    for (var i = 52; i--;) {
        var hai = hai14_arr[i];
        if (hai > 0) {
            hai_count += hai;
            hai2_idx = hai1_idx;
            hai1_idx = i;
            if (search14) {
                hai14_idx = i;
                search14 = false;
            } else {
                if (search13) {
                    hai13_idx = i;
                    search13 = false;
                }
            }
        }
        if (hai > 1) { atama_arr.push(i); }
    }
    if (hai_count != 14) { return false; }
    if (atama_arr.length == 7) {//七对
        return ["chiitoi", atama_arr];
    }

    var step1arr = [];
    var stpe1hai6 = [];
    //去掉雀头，取剩下 => hai12_arr
    for (var i = atama_arr.length; i--;) {
        var atama = atama_arr[i];//atama=雀头index
        var hai12_arr = hai14_arr.concat();//深拷贝
        hai12_arr[atama] -= 2;//去掉雀头的数组
        var haimin = hai1_idx;//牌最小值
        var haimax = hai14_idx;//牌最大值
        if (hai12_arr[atama] == 0) {
            if (atama == hai14_idx) {
                haimax = hai13_idx;
            }
            if (atama == hai1_idx) {
                haimin = hai2_idx;
            }
        }
        var min_ke = hai12_arr[haimin] > 2;
        var min_shun = hai12_arr[haimin + 1] > 0 && hai12_arr[haimin + 2] > 0;
        var max_ke = hai12_arr[haimax] > 2;
        var max_shun = hai12_arr[haimax - 1] > 0 && hai12_arr[haimax - 2] > 0;
        if (min_ke && max_ke) {//如果最小值可以组刻子，最大值可以组刻子
            var hai6 = hai12_arr.concat();
            hai6[haimin] -= 3;
            hai6[haimax] -= 3;
            stpe1hai6.push(hai6);
            step1arr.push([atama,
                haimin, haimin, haimin,
                haimax, haimax, haimax
            ])
        }
        if (min_ke && max_shun) {//如果最小值可以组刻子，最大值可以组顺子
            var hai6 = hai12_arr.concat();
            hai6[haimin] -= 3;
            hai6[haimax] -= 1;
            hai6[haimax - 1] -= 1;
            hai6[haimax - 2] -= 1;
            stpe1hai6.push(hai6);
            step1arr.push([atama,
                haimin, haimin, haimin,
                haimax - 2, haimax - 1, haimax
            ])
        }
        if (min_shun && max_ke) {//如果最小值可以组顺子，最大值可以组刻子
            var hai6 = hai12_arr.concat();
            hai6[haimin] -= 1;
            hai6[haimin + 1] -= 1;
            hai6[haimin + 2] -= 1;
            hai6[haimax] -= 3;
            stpe1hai6.push(hai6);
            step1arr.push([atama,
                haimin, haimin + 1, haimin + 2,
                haimax, haimax, haimax
            ])
        }
        if (min_shun && max_shun) {//如果最小值可以组顺子，最大值可以组顺子
            var hai6 = hai12_arr.concat();
            hai6[haimin] -= 1;
            hai6[haimin + 1] -= 1;
            hai6[haimin + 2] -= 1;
            hai6[haimax] -= 1;
            hai6[haimax - 1] -= 1;
            hai6[haimax - 2] -= 1;
            stpe1hai6.push(hai6);
            step1arr.push([atama,
                haimin, haimin + 1, haimin + 2,
                haimax - 2, haimax - 1, haimax
            ])
        }
    }//for
    var agariarr = [];
    //拆解6张牌
    for (var i = stpe1hai6.length; i--;) {
        var hai6_arr = stpe1hai6[i];
        var haimin = 0;//牌最小值
        var haimax = 51;//牌最大值
        var search6 = true;
        for (var j = 52; j--;) {
            var hai = hai6_arr[j];
            if (hai6_arr[j] > 0) {
                haimin = j;
                if (search6) {
                    haimax = j;
                    search6 = false;
                }
            }//if > 0
        }//for j
        var min_ke = hai6_arr[haimin] > 2;
        var min_shun = hai6_arr[haimin + 1] > 0 && hai6_arr[haimin + 2] > 0;
        var max_ke = hai6_arr[haimax] > 2;
        var max_shun = hai6_arr[haimax - 1] > 0 && hai6_arr[haimax - 2] > 0;
        if (min_ke && max_ke) {
            agariarr.push(step1arr[i].concat([
                haimin, haimin, haimin,
                haimax, haimax, haimax
            ]));
        }
        if (min_ke && max_shun) {
            if (haimin == haimax - 2 && hai6_arr[haimin] < 3) { } else {
                agariarr.push(step1arr[i].concat([
                    haimin, haimin, haimin,
                    haimax - 2, haimax - 1, haimax
                ]));
            }
        }
        if (min_shun && max_ke) {
            if (haimin == haimax - 2 && hai6_arr[haimax] < 3) { } else {
                agariarr.push(step1arr[i].concat([
                    haimin, haimin + 1, haimin + 2,
                    haimax, haimax, haimax
                ]));
            }
        }
        if (min_shun && max_shun) {
            /**
             * 123m 456m(o=5)
             * 123m 345m(o=4) hai6_arr[min+2]==2
             * 123m 234m(o=3) hai6_arr[min+2]==2 hai6_arr[min+1]==2
             * 123m 123m(o=2) hai6_arr[min+2]==2 hai6_arr[min+1]==2
             * -----
             * 123m 222m(o=2) hai6_arr[min+2]==4
             */
            var o = haimax - haimin;
            var c0 = (hai6_arr[haimin] == 2) ? true : false;
            var c1 = (hai6_arr[haimin + 1] == 2) ? true : false;
            var c2 = (hai6_arr[haimin + 2] == 2) ? true : false;
            if (
                o > 4
                || (o == 4 && c2)
                || (o == 3 && c2 && c1)
                || (o == 2 && c2 && c1 && c0)
            ) {
                agariarr.push(step1arr[i].concat([
                    haimin, haimin + 1, haimin + 2,
                    haimax - 2, haimax - 1, haimax
                ]));
            } else {
                if (o == 2 && hai6_arr[haimin + 1] == 4) {
                    agariarr.push(step1arr[i].concat([
                        haimin, haimin + 1, haimin + 2,
                        haimin + 1, haimin + 1, haimin + 1
                    ]));
                }
            }
        }
    }//for i  
    return (agariarr.length == 0) ? false : agariarr;
}
