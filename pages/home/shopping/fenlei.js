var app = getApp()
Page({
	data: {
		hidden:false,//控制加载框的显示与隐藏
		curNav:1,
		curIndex:0,
		cart:[],
		cartTotal:0,
		totalPrices:0,
		navList:[
			{
				id:1,
				name:'被子'
			},
			{
				id:2,
				name:'褥子'
			},
			{
				id:3,
				name:'床单'
			},
			{
				id:4,
				name:'被罩'
			},
			{
				id:5,
				name:'脸盆'
			},
			{
				id:6,
				name:'暖壶'
			}
		],
		classifyList:[
			[
				{
					name:"厚被子",
					price:8,
					num:1,
					id:1
				},
				{
					name:"薄被子",
					price:8,
					num:1,
					id:2
				},
				{
					name:"夏凉被",
					price:8,
					num:1,
					id:3
				}
			],
			[
				{
					name:"厚褥子",
					price:8,
					num:1,
					id:4
				},
				{
					name:"海绵",
					price:8,
					num:1,
					id:5
				}
			],
			[
				{
					name:"白床单",
					price:8,
					num:1,
					id:6
				},
				{
					name:"花床单",
					price:8,
					num:1,
					id:7
				},
				{
					name:"浅色床单",
					price:8,
					num:1,
					id:8
				}
			],
			[	{
					name:"花被罩",
					price:8,
					num:1,
					id:9
				},
				{
					name:"单色被罩",
					price:8,
					num:1,
					id:10
				}
			],
			[	{
					name:"大脸盆",
					price:8,
					num:1,
					id:11
				},
				{
					name:"小脸盆",
					price:8,
					num:1,
					id:12
				}
			],
			[	{
					name:"大暖壶",
					price:8,
					num:1,
					id:13
				},
				{
					name:"小暖壶",
					price:8,
					num:1,
					id:14
				}
			]
		],
	
	},
	loadingChange () {//时间延迟，模仿加载
		setTimeout(() => {
			this.setData({
				hidden:true
			})
		},1000)
	},
	//选择分类
	selectNav (event) {//event.target.dataset. 获取事件中的数据
		let id = event.target.dataset.id,
			index = parseInt(event.target.dataset.index);
			self = this;
		this.setData({
			curNav:id,
			curIndex:index
		})
	},
	//选择分类对应的数据
	selectNavData (event) {
		let classifyid = event.currentTarget.dataset.classify;
		let flag = true;
		let	cart = this.data.cart;
		
		if(cart.length > 0){
			cart.forEach(function(item,index){
				if(item == classifyid){
					cart.splice(index,1);//splice(删除的位置，删除的数量)
					flag = false;
			
				}
			})
		}
		if(flag) cart.push(classifyid);//把classifyid数据添加到cart中
		this.setData({
			cartTotal:cart.length
		})
		this.setStatus(classifyid)
	},
	setStatus (classifyId) {
		let classifyList = this.data.classifyList;
		for (let classify of classifyList){
			classify.forEach((item) => {
				if(item.id == classifyId){
					item.status = !item.status || false
				}
			})
		}
		
		this.setData({
			classifyList:this.data.classifyList
		})
	},
	onLoad () {
		this.loadingChange()
	}
})