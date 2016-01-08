function proxyFactory(before, after) {
    var $accessors = {}
    var keys = {}
    //收集所有键值对及访问器属性
    for (var key in before) {
        keys[key] = before[key]
        var accessor = Object.getOwnPropertyDescriptor(before, key)
        if (accessor.set) {
            $accessors[key] = accessor
        }
    }
    for (var key in after) {
        keys[key] = after[key]
        var accessor = Object.getOwnPropertyDescriptor(after, key)
        if (accessor.set) {
            $accessors[key] = accessor
        }
    }

    var $vmodel = new SubComponent()
    Object.defineProperties($vmodel, $accessors)

    for (key in keys) {
        if (!$accessors[key]) {//添加不可监控的属性
            $vmodel[key] = keys[key]
        }
        keys[key] = true
    }

    function hasOwnKey(key) {
        return keys[key] === true
    }

    hideProperty($vmodel, "hasOwnProperty", hasOwnKey)
    var id = after.$id ? before.$id + "??" + after.$id : before.$id
    hideProperty($vmodel, id)

    makeFire($vmodel)

    hideProperty($vmodel, "$active", true)
    return $vmodel
}
