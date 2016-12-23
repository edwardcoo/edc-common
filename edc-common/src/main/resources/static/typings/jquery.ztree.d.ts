interface ZTreeOptions {
    treeId?: string;
    treeObj?: JQuery;
    async?: {
        autoParam?: string[],
        contentType?: string,
        dataFilter?: (treeId: string, parentNode: ZTreeNode, responseData: any) => ZTreeNode | ZTreeNode[],
        dataType?: string,
        enable?: boolean,
        otherParam?: string[] | Object,
        type?: string,
        url?: (treeId: string, treeNode: ZTreeNode) => string | string,
    };
    callback?: any;
    check?: any;
    data?: any;
    edit?: any;
    view?: any;
}

interface ZTreeNode {
    /**
     * 任意自定义数据
     */
    [prop: string]: any;
    /**
     * 节点的 checkBox / radio 的 勾选状态
     */
    checked: boolean;
    /**
     * 强制节点的 checkBox / radio 的 半勾选状态。[setting.check.enable = true & treeNode.nocheck = false 时有效]
     */
    halfCheck: boolean;
    /**
     * 节点的子节点数据集合
     */
    children: ZTreeNode[];
    /**
     * 设置节点的 checkbox / radio 是否禁用
     */
    chkDisabled: boolean;
    // click: string;
    /**
     * 节点自定义图标的 URL 路径
     */
    icon: string;
    /**
     * 父节点自定义折叠时图标的 URL 路径
     */
    iconClose: string;
    /**
     * 父节点自定义展开时图标的 URL 路径
     */
    iconOpen: string;
    /**
     * 节点自定义图标的 className
     */
    iconSkin: string;
    /**
     * 判断 treeNode 节点是否被隐藏
     */
    isHidden: boolean;
    /**
     * 记录 treeNode 节点是否为父节点
     */
    isParent: boolean;
    /**
     * 节点名称
     */
    name: string;
    /**
     * 设置节点是否隐藏 checkbox / radio
     */
    nocheck: boolean;
    /**
     * 记录 treeNode 节点的 展开 / 折叠 状态
     */
    open: boolean;
    /**
     * 设置点击节点后在何处打开 url
     */
    target: string;
    /**
     * 节点链接的目标 URL
     */
    url: string;
    /**
     * 用于设置节点的子节点的 checkBox / radio 的半选状态
     */
    check_Child_State: number;
    check_Focus: boolean;
    checkedOld: boolean;
    editNameFlag: boolean;
    isAjaxing: boolean;
    isFirstNode: boolean;
    isHover: boolean;
    isLastNode: boolean;
    level: number;
    parentTId: string;
    tId: string;
    zAsync: boolean;
    /**
     * 获取节点 checkbox / radio 半勾选状态
     */
    getCheckStatus(): {checked: boolean, half: boolean};
    /**
     * 获取 treeNode 节点在同级节点中的位置
     */
    getIndex(): number;
    /**
     * 获取与 treeNode 节点相邻的后一个节点
     */
    getNextNode(): ZTreeNode;
    /**
     * 获取 treeNode 节点的父节点(如果 treeNode 是根节点，返回 null)
     */
    getParentNode(): ZTreeNode;
    /**
     * 获取 treeNode 节点的所有父节点（包括自己）
     */
    getPath(): ZTreeNode[];
    /**
     * 获取与 treeNode 节点相邻的前一个节点
     */
    getPreNode(): ZTreeNode;
}

interface ZTree {
    /**
     * zTree 对象使用的 setting 配置数据
     */
    setting: ZTreeOptions;
    /**
     * 添加节点
     *
     * @param parentNode 指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可(请务必保证此节点数据对象 是 zTree 内部的数据对象)
     * @param newNodes 需要增加的节点数据 JSON 对象集合，数据只需要满足 zTree 的节点数据必需的属性即可
     * @param isSilent 设定增加节点后是否自动展开父节点，true 表示不展开父节点（默认为展开）
     */
    addNodes(parentNode: ZTreeNode, newNodes: ZTreeNode | ZTreeNode[], isSilent?: boolean): ZTreeNode[];
    /**
     * 添加节点
     *
     * @param parentNode 指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可(请务必保证此节点数据对象 是 zTree 内部的数据对象)
     * @param index 新节点插入的位置（从 0 开始），index = -1 时，插入到最后
     * @param newNodes 需要增加的节点数据 JSON 对象集合，数据只需要满足 zTree 的节点数据必需的属性即可
     * @param isSilent 设定增加节点后是否自动展开父节点，true 表示不展开父节点（默认为展开）
     */
    addNodes(parentNode: ZTreeNode, index: number, newNodes?: ZTreeNode | ZTreeNode[], isSilent?: boolean): ZTreeNode[];
    /**
     * 取消节点的编辑名称状态，可以恢复原名称，也可以强行赋给新的名称
     *
     * @param newName 重新给定的新名称，如果省略此参数，则恢复原名称。
     */
    cancelEditName(newName?: string);
    /**
     * 取消节点的选中状态
     *
     * @param treeNode 需要取消选中状态的节点，如果省略此参数，则将取消全部被选中节点的选中状态
     */
    cancelSelectedNode(treeNode?: ZTreeNode);
    /**
     * 勾选 或 取消勾选 全部节点
     *
     * @param checked 是否选中
     */
    checkAllNodes(checked: boolean);
    /**
     * 勾选 或 取消勾选 单个节点
     *
     * @param treeNode 需要勾选 或 取消勾选 的节点数据
     * @param checked 是否选中(省略此参数，则根据对此节点的勾选状态进行 toggle 切换)
     * @param checkTypeFlag 表示是否按照 setting.check.chkboxType 属性进行父子节点的勾选联动操作
     * @param callbackFlag 表示是否执行此方法时触发 beforeCheck & onCheck 事件回调函数
     */
    checkNode(treeNode: ZTreeNode, checked?: boolean, checkTypeFlag?: boolean, callbackFlag?: boolean);
    /**
     * 要复制到的目标节点 JSON 数据
     *
     * @param targetNode 要复制到的目标节点 JSON 数据
     * @param treeNode 需要被复制的节点数据
     * @param moveType 复制到目标节点的相对位置
     * @param isSilent 设定复制节点后是否自动展开父节点
     */
    copyNode(targetNode: ZTreeNode, treeNode: ZTreeNode, moveType: "inner" | "prev" | "next", isSilent: boolean): ZTreeNode;
    /**
     * 销毁 zTree 对象
     */
    destroy();
    /**
     * 设置某节点进入编辑名称状态
     *
     * @param treeNode 指定进入编辑名称状态的节点
     */
    editName(treeNode: ZTreeNode);
    /**
     * 展开 / 折叠 全部节点
     *
     * @param expandFlag true 表示展开全部节点,  false 表示折叠全部节点
     */
    expandAll(expandFlag: boolean): boolean | null;
    /**
     * 展开 / 折叠 指定的节点
     *
     * @param treeNode 需要 展开 / 折叠 的节点数据
     * @param expandFlag true 表示展开节点,  false 表示折叠节点
     * @param sonSign true 表示对全部子孙节点进行与 expandFlag 相同的操作
     * @param focus 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内
     * @param callbackFlag true 表示执行此方法时触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数
     */
    expandNode(treeNode: ZTreeNode, expandFlag?: boolean, sonSign?: boolean, focus?: boolean, callbackFlag?: boolean): boolean;
    /**
     * 获取输入框勾选状态被改变的节点集合（与原始数据 checkedOld 对比）
     */
    getChangeCheckedNodes(): ZTreeNode[];
    /**
     * 获取输入框被勾选 或 未勾选的节点集合
     *
     * @param checked
     */
    getCheckedNodes(checked?: boolean): ZTreeNode[];
    /**
     * 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象
     *
     * @param key 需要精确匹配的属性名称
     * @param value 需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可
     * @param parentNode 搜索范围，指定在某个父节点下的子节点中进行搜索(忽略此参数，表示在全部节点中搜索)
     */
    getNodeByParam(key: string, value: any, parentNode?: ZTreeNode): ZTreeNode;
    /**
     * 根据 zTree 的唯一标识 tId 快速获取节点 JSON 数据对象
     *
     * @param tId 节点在 zTree 内的唯一标识 tId
     */
    getNodeByTId(tId: string): ZTreeNode;
    /**
     * 获取某节点在同级节点中的序号（从0开始）
     *
     * @param treeNode
     */
    getNodeIndex(treeNode: ZTreeNode): number;
    /**
     * 获取 zTree 的全部节点数据, 仅仅是根节点的集合（默认情况子节点都处于 children 属性下）
     */
    getNodes(): ZTreeNode[];
    /**
     * 根据自定义规则搜索节点数据 JSON 对象集合 或 单个节点数据
     *
     * @param filter 自定义过滤器函数
     * @param isSingle true 表示只查找单个节点
     * @param parentNode 可以指定在某个父节点下的子节点中搜索(忽略此参数，表示在全部节点中搜索)
     * @param invokeParam 用户自定义的数据对象，用于 filter 中进行计算
     */
    getNodesByFilter(filter: (n: ZTreeNode) => boolean, isSingle?: boolean, parentNode?: ZTreeNode, invokeParam?: any): ZTreeNode | ZTreeNode[];
    /**
     * 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象集合
     *
     * @param key 需要精确匹配的属性名称
     * @param value 需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可
     * @param parentNode 可以指定在某个父节点下的子节点中搜索(忽略此参数，表示在全部节点中搜索)
     */
    getNodesByParam(key: string, value: any, parentNode?: ZTreeNode): ZTreeNode[];
    /**
     * 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象集合
     *
     * @param key 需要模糊匹配的属性名称
     * @param value 需要模糊匹配的属性值
     * @param parentNode 可以指定在某个父节点下的子节点中搜索(忽略此参数，表示在全部节点中搜索)
     */
    getNodesByParamFuzzy(key: string, value: string, parentNode?: ZTreeNode): ZTreeNode[];
    /**
     * 获取 zTree 当前被选中的节点数据集合
     */
    getSelectedNodes(): ZTreeNode[];
    /**
     * 隐藏某个节点
     *
     * @param node 被隐藏的节点
     */
    hideNode(node: ZTreeNode);
    /**
     * 隐藏某个节点
     *
     * @param nodes 被隐藏的节点集合
     */
    hideNodes(nodes: ZTreeNode[]);
    /**
     * 移动节点
     *
     * @param targetNode 要移动到的目标节点
     * @param treeNode 需要被移动的节点数据
     * @param moveType 指定移动到目标节点的相对位置
     * @param isSilent 设定移动节点后是否自动展开父节点
     *
     * @return 正常情况下与 treeNode 参数完全相同, null 表示移动失败
     */
    moveNode(targetNode: ZTreeNode, treeNode: ZTreeNode, moveType: "inner" | "prev" | "next", isSilent: boolean): ZTreeNode | null;
    /**
     * 强行异步加载父节点的子节点
     *
     * @param parentNode 指定需要异步加载的父节点 JSON 数据
     * @param reloadType "refresh" 表示清空后重新加载，否则表示追加子节点处理
     * @param isSilent 设定异步加载后是否自动展开父节点。
     */
    reAsyncChildNodes(parentNode: ZTreeNode, reloadType: "refresh" | string, isSilent: boolean);
    /**
     * 刷新 zTree, 没有特殊必要，尽量不要使用此方法。单个节点更新请使用 updateNode 方法，异步加载模式下请使用 reAsyncChildNodes 方法
     */
    refresh();
    /**
     * 清空某父节点的子节点。请勿用此方法清空根节点，如果需要清空根节点，直接初始化 zTree，并且设置初始节点为 null 即可。
     *
     * @param parentNode 需要清空子节点的父节点数据
     */
    removeChildNodes(parentNode: ZTreeNode): ZTreeNode[];
    /**
     * 删除节点
     *
     * @param treeNode 需要被删除的节点数据
     * @param callbackFlag true 表示执行此方法时触发 beforeRemove & onRemove 事件回调函数(默认false)
     */
    removeNode(treeNode: ZTreeNode, callbackFlag?: boolean);
    /**
     * 选中指定节点
     *
     * @param treeNode 需要被选中的节点数据
     * @param addFlag true 表示追加选中，会出现多点同时被选中的情况(默认 false)
     * @param isSilent true 选中节点时，不会让节点自动滚到到可视区域内(默认 false)
     */
    selectNode(treeNode: ZTreeNode, addFlag?: boolean, isSilent?: boolean);
    /**
     * 禁用 或 解禁 某个节点的 checkbox / radio
     *
     * @param node 需要禁用 或 解禁 checkbox / radio 的节点
     * @param disabled true 表示禁用 checkbox / radio, 省略此参数，等同于 disabled = false
     * @param inheritParent true 表示全部父节点进行同样的操作, 省略此参数，等同于 inheritParent = false
     * @param inheritChildren true 表示全部子节点进行同样的操作, 省略此参数，等同于 inheritParent = false
     */
    setChkDisabled(node: ZTreeNode, disabled: boolean, inheritParent: boolean, inheritChildren: boolean);
    /**
     * 设置 zTree 进入 / 取消 编辑状态。
     *
     * @param editable true 表示进入 编辑状态
     */
    setEditable(editable: boolean);
    /**
     * 显示某个被隐藏的节点
     *
     * @param treeNode 指定被显示的节点
     */
    showNode(treeNode: ZTreeNode);
    /**
     * 显示一批已经被隐藏的节点
     *
     * @param treeNodes 指定被显示的节点
     */
    showNodes(treeNodes: ZTreeNode[]);
    /**
     * 将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
     *
     * @param treeNodes 需要被转换的 zTree 节点数据对象集合 或 某个单独节点的数据对象
     */
    transformToArray(treeNodes: ZTreeNode | ZTreeNode[]): ZTreeNode[];
    /**
     * 将简单 Array 格式数据转换为 zTree 使用的标准 JSON 嵌套数据格式。
     *
     * @param simpleNodes 需要被转换的简单 Array 格式数据 或 某个单独的数据对象
     */
    transformTozTreeNodes(simpleNodes: ZTreeNode | ZTreeNode[]): ZTreeNode[];
    /**
     * 更新某节点数据，主要用于该节点显示属性的更新。
     *
     * @param treeNode 需要更新的节点
     * @param checkTypeFlag true 表示按照 setting.check.chkboxType 属性进行父子节点的勾选联动操作
     */
    updateNode(treeNode: ZTreeNode, checkTypeFlag?: boolean);
}

interface ZTreeStatic {
    init(container: JQuery, options?: ZTreeOptions, nodes?: any): ZTree;
    getZTreeObj(treeId: string): ZTree;
    destroy(treeId?: string);
}

interface JQueryStatic {
    zTree: ZTreeStatic;
}
