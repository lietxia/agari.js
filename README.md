# 快速判断麻将和牌的算法

# 用法
```
//只能输入14张牌，副露也要打进去
//m=万，p=筒，s=索，z=字牌(1234567z分别代表：东南西北白发中)

agari(str2hai("123m123p12399s111z"))
//返回=> [[30,0,1,2,33,33,33,11,12,13,22,23,24]]

hai2str(agari(str2hai("11122233344455m")))
/*
返回值⬇️ 第一个是雀头
一般形
5m 1m2m3m 4m4m4m 1m2m3m 1m2m3m
5m 1m1m1m 2m3m4m 2m3m4m 2m3m4m
5m 1m1m1m 4m4m4m 2m2m2m 3m3m3m
2m 1m1m1m 3m4m5m 2m3m4m 3m4m5m
*/
```

# 思路
## 第一步
1. 牌从小到大排列一次。
2. 找到数量大于2的牌，它可以当作雀头，用数组atama_arr保存雀头{最多7可能}；

## 第二步
1. 读取数组atama_arr的一个雀头
2. 【14张手牌】去掉这个雀头后，剩余的12张牌，进行4个判断:  
    * A. 最左边的牌，否能组出顺子  
    * B. 最左边的牌，否能组出刻子  
    * C. 最右边的牌，否能组出顺子  
    * D. 最右边的牌，否能组出刻子  
    {由最小值，最大值组出面子，最多4种可能}  
3. 如果AB有一个以上符合，CD有一个以上符合`if((A || b) && (C || D))`，就继续判断。否则读取新的雀头，重做第二步
4. 【14张手牌】去掉【雀头 + 由最小值，最大值组成的面子】后，得到【6张牌】
5. 对【6张牌】判断最小值，最大值是否构成面子。如果能组，再对比前后是否发生改变(122344符合最小值最大值都是顺子，但他非法，需要抛弃)，得到一个合法的拆牌可能。
6. 上面一步有个例外，就是(233334)符合最小值最大值都是顺子，但他是合法的和牌形，单独处理即可。
