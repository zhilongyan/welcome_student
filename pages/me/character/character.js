// pages/me/character/character.js
let app = getApp();
Page({
  data: {
    character: [
      {
        name: "兴趣爱好",
        introduce: "有爱好才有朋友",
        detail: [{ name: "K歌", color: false }, { name: "果粉", color: false }, { name: "购物狂", color: false }, { name: "美食", color: false }, { name: "电影", color: false }, { name: "摄影", color: false }, { name: "旅游", color: false }, { name: "手机控", color: false }, { name: "读书", color: false }, { name: "动漫", color: false }, { name: "游戏", color: false }, { name: "爱狗", color: false }, { name: "爱猫", color: false }, { name: "运动", color: false }, { name: "电视剧", color: false }, { name: "桌游", color: false }]
      },
      {
        name: "自我个性",
        introduce: "我是什么样的人？",
        detail: [{ name: "成熟", color: false }, { name: "各种宅", color: false }, { name: "幽默", color: false }, { name: "爱时尚", color: false }, { name: "执着", color: false }, { name: "温柔", color: false }, { name: "直率", color: false }, { name: "闷骚", color: false }, { name: "善良", color: false }, { name: "低调", color: false }, { name: "自由", color: false }, { name: "阳光", color: false }, { name: "乐观", color: false }, { name: "完美主义", color: false }, { name: "自信", color: false }, { name: "萌", color: false }]
      },
      {
        name: "年代星座",
        introduce: "哪些是速配星座？",
        detail: [{ name: "70后", color: false }, { name: "80后", color: false }, { name: "90后", color: false }, { name: "00后", color: false }, { name: "白羊座", color: false }, { name: "金牛座", color: false }, { name: "双子座", color: false }, { name: "巨蟹座", color: false }, { name: "狮子座", color: false }, { name: "处女座", color: false }, { name: "天秤座", color: false }, { name: "射手座", color: false }, { name: "天蝎座", color: false }, { name: "摩羯座", color: false }, { name: "水瓶座", color: false }, { name: "双鱼座", color: false },]
      },
      {
        name: '现在状态',
        introduce: "我最近的状态",
        detail: [{ name: "单身待解救", color: false }, { name: "静待缘分", color: false }, { name: "起床困难户", color: false }, { name: "奋斗ing", color: false }, { name: "努力加班", color: false }, { name: "幸福ing", color: false }, { name: "学习ing", color: false }, { name: "减肥ing", color: false }, { name: "失恋ing", color: false }, { name: "热恋ing", color: false }, { name: "纠结ing", color: false }, { name: "寂寞ing", color: false }, { name: "缺爱ing", color: false }, { name: "成长ing", color: false }]
      },
      {
        name: "热门新词",
        introduce: '哪个热词你躺着中枪了呢？',
        detail: [{ name: "爱小苹果", color: false }, { name: "屌丝", color: false }, { name: "白富美", color: false }, { name: "暖男", color: false }, { name: "高大硬", color: false }, { name: "也是醉了", color: false }, { name: "土豪", color: false }, { name: "4B青年", color: false }, { name: "女汉子", color: false }, { name: "熟女", color: false }, { name: "有人鱼线", color: false }, { name: "有钱任性", color: false }, { name: "愤青", color: false }, { name: "腐女", color: false }, { name: "御姐", color: false }, { name: "有马甲线", color: false }]
      },
      {
        name: '超能力',
        introduce: "牛逼的人生无需解释",
        detail: [{ name: "舌头打桃结", color: false }, { name: "记忆力超常", color: false }, { name: "过目不忘", color: false }, { name: "力大无穷", color: false }, { name: "晒不黑", color: false }, { name: "狂吃不胖", color: false }, { name: "没生过病", color: false }, { name: "睁眼睡觉", color: false }, { name: "耳朵能动", color: false }, { name: "倒立睡觉", color: false }, { name: "一字马", color: false }, { name: "单个眉毛动", color: false }, { name: "舌头舔鼻子", color: false }, { name: "对眼", color: false }, { name: "口吞舌头", color: false }, { name: "长时憋气", color: false }]
      }
    ],
    characterName: []
  },
  onLoad: function (options) {
    let student = wx.getStorageSync('student_Info');
    let characterName = app.changeCharacter(student.tag);
    let character = this.data.character;
    for(let i=0;i<characterName.length;i++){
      let j = characterName[i];
      character[j.swiperIndex].detail[j.characterIndex].color = true;
    }
    this.setData({character:character,characterName:characterName})
  },
  selectCharacter: function (e) {
    console.log(e);

    // 获得是swiper的那个页面
    let swiperIndex = e.currentTarget.id;
    // 获得当前页面中的哪个性格
    let characterIndex = e.target.id;
    // 获得当前用户选择的性格名字
    let name = e.target.dataset.name;
    // 判断用户是否点击空白地方
    if (name == null) {
      return;
    }
    // 获得所有的性格
    let character = this.data.character;
    // 获得用户已经选好的性格
    var characterName = this.data.characterName;
    // 如果用户所选择的性格大于7个则判断用户是选择这个性格还是取消选择这个性格
    if (characterName.length >= 7) {
      // 如果character[swiperIndex].detail[characterIndex].color == true则表示现在用户的的动作是取消这个选择
      if (character[swiperIndex].detail[characterIndex].color) {
        // character[swiperIndex].detail[characterIndex].color = !character[swiperIndex].detail[characterIndex].color;
      } else {
        app.showErrorModal("最多只能选择7种性格");
        return
      }
    }
    // 将选中的性格的color取反
    character[swiperIndex].detail[characterIndex].color = !character[swiperIndex].detail[characterIndex].color;
    let object = {
      name: name,
      swiperIndex: swiperIndex,
      characterIndex: characterIndex
    }
    // 如果取反后变为true，则说明用户选中这个性格了
    if (character[swiperIndex].detail[characterIndex].color) {

      // 将这个性格放进数组中
      characterName.push(object);

    } else {
      characterName = app.removeArrayValue(characterName, object);
    }
    // 更新data中用户的性格
    this.setData({ characterName: characterName, character: character })

  },
  // 点击中间部分（即已经选好的性格）的时候删除当前性格
  delete: function (e) {
    // 获得点击的名字
    console.log(e)
    let name = e.target.dataset.name;
    let swiperIndex = e.target.dataset.swiperindex;
    let characterIndex = e.target.dataset.characterindex;
    let object = {
      name : name,
      swiperIndex:swiperIndex,
      characterIndex:characterIndex
    }
    let characterName = this.data.characterName;
    let newCharacterName = app.removeArrayValue(characterName, object);
    let character = this.data.character;
    character[swiperIndex].detail[characterIndex].color = false;
    this.setData({ characterName: newCharacterName,character:character });
  },
  // 保存按钮
  keep : function(){
     let characterName = this.data.characterName;
     var character = '';
     for(let i=0;i<characterName.length;i++){
       character += characterName[i].name+"," + characterName[i].swiperIndex+"," + characterName[i].characterIndex+","
     }
     var student = wx.getStorageSync('student_Info');
     let studentNum = student.studentnum;
     let data = {
       studentNum:studentNum,
       tag:character
     }
     app.putRequest("/student/stuUpdate",data,function(res){
       let status = res.data.status;
       if(status == 1){
         console.log("============保存成功===========")
         student.tag = character;
         wx.setStorageSync('student_Info', student);
         wx.navigateBack({
           delta: 1,
         })
       }else{
         let msg = res.data.msg;
         app.showErrorModal(msg)
       }
     })
  }
})