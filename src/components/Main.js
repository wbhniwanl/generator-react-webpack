'use strict';
require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关的数据
var imageDatas = require('../data/imageData.json');
//利用自执行函数，将图片信息转化为URl信息
    imageDatas = ((imageDatasArr)=>{
    for (var i = 0; i < imageDatasArr.length; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

//ES6写法
var getRangeRandom=(low ,high)=>Math.ceil(Math.random() *　(high - low) + low);
//获取0-30度之间的任意正负值
var get30DegRandom = () =>{
   return ((Math.random() > 0.5 ? '': '-' ) + Math.ceil(Math.random() * 30))
};
class ImgFigur extends React.Component{

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        if (this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        var styleObj = {};
        //如果props属性中指定了这张图片的位置 则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        //如果图片的旋转角度有值并且不为0 则添加旋转角度
        if(this.props.arrange.rotate){
            //生产一个厂商前缀的数组  用于解决个个版本的兼容性问题
            (['MozTransform', 'msTransform', 'WebTransform', 'transform']).forEach((value)=>{
                styleObj[value] = 'rotate(' + this.props.arrange.rotate +
                        'deg)';
            });
        }
        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }
        let imgFigureClassName = "ima-figure";
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return(
            //规定自包含的单个单元内容 （单元内容：单独拿出来放到哪里都是有意义的，并且伴有figuretion标题说明）
            //如果一个方法里面还有其他方法这直接调用它函数对于的名字就可以不用加（）
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="ima-title">{this.props.data.title}</h2>
                    <div className='img-back' onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class ControllerUnit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        if (this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        let controlelrUnitClassName = "controller-unit";
         if (this.props.arrange.isCenter){
             controlelrUnitClassName += ' is-center';
             if (this.props.arrange.isInverse){
                 controlelrUnitClassName += ' is-inverse';
             }
         }
        return (
            <span className={controlelrUnitClassName} onClick={this.handleClick}></span>
        );

    }
}
class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            //中心方向
            centerPos: {
                left: 0,
                right: 0
            },
            //水平方向的取值范围
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            //垂直方向的取值范围
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state ={
            imgsArragenArr:[
                /*{
                 //pos == position
                 pos: {
                 left: '0',
                 top : '0'
                 }
                 rotate :0 ;//旋转角度
                 isInverse :false //表示图片正反面
                 isCenter ; false //表示开启居中的图片
                 }*/

            ]
        };
    }
    /*
    翻转图片
    @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
    @return {function} 这是一个闭包函数 ，其内return一个真正待被执行的函数
    在js中只要函数内部的子函数才可以读取局部变量：即函数内部的函数 就是函数内容和外部的链接起来的一个桥梁
    */

    inverse(index){
        return () =>{
            //使用闭包函数是因为在imgfigures组件使用inserve函数时,[index]已经被定下来了所以直接调用时其实是在调用return的函数
        var imgsArragenArr = this.state.imgsArragenArr;
            imgsArragenArr[index].isInverse=!imgsArragenArr[index].isInverse;
            this.setState({
                imgsArragenArr : imgsArragenArr
            });
        }
    }

/*
获取区间内的一个随机值
 */

/*
重新布局所以图片
指定centetIndex 指定居中布局的哪个图片
 */
     rearragen(centerIndex){
         var imgsArragenArr = this.state.imgsArragenArr,
             Constant=this.Constant,
             centerPos  =Constant.centerPos,
             hPosRange  =Constant.hPosRange,
             vPosRange  = Constant.vPosRange,
             hPosRangeleftSecX =hPosRange.leftSecX,
             hPosRangerightSecX= hPosRange.rightSecX,
             hPosRangeY = hPosRange.y,
             vPosRangeX= vPosRange.x,
             vPosRangeTopY = vPosRange.topY,
             imgsArragenTopArr = [], //定义一个数组用来存放图片上侧区域的状态信息
             topImgNum  = Math.floor(Math.random() * 2),//取一个或不取
             topImgSpliceIndex = 0, //用来标记我们存放在上侧的图片是从数组的哪个位置拿出来的
             imgsArrangenCenterArr = imgsArragenArr.splice(centerIndex, 1);//获取中心图片的信息
            //首先居中centerIndex的图片
             imgsArrangenCenterArr[0]={
                 pos: centerPos,
                 rotate : 0,
                 isCenter: true
             };

            //居中的centerIndex的图片不需要旋转
             //取出要布局上侧的状态信息
             topImgSpliceIndex =  Math.ceil(Math.random(imgsArragenArr.length - topImgNum));  //-topImgNum是因为我们是从索引位置往后取的
             imgsArragenTopArr = imgsArragenArr.splice(topImgSpliceIndex,topImgNum);
         
             //布局位于上侧的图片
             imgsArragenTopArr.forEach(function (value,index) {
                 imgsArragenTopArr[index] = {
                     pos :{
                         top  : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),//使用一个范围所以要封装一个函数
                         left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                     rotate : get30DegRandom(),
                     isCenter:false
                 }
             });
          //布局左侧的图片信息
         for (var i = 0 , j = imgsArragenArr.length , k = j / 2;i<j; i++){
             var hPosRangeLORX = null ; //临时变量获取左右区域的X值的变量
         //前半部分布局左边 ， 右半部分布局右边
             if(i < k){
                 hPosRangeLORX = hPosRangeleftSecX;
                }else {
                 hPosRangeLORX = hPosRangerightSecX;
             }
             imgsArragenArr[i] ={
                 pos :{
                     top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                     left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                 },
                 rotate : get30DegRandom(),
                 isCenter:false
             }

         }
         //如果有图像上侧信息给塞回补全
        if (imgsArragenTopArr && imgsArragenTopArr[0]){
            imgsArragenArr.splice(topImgSpliceIndex , 0 ,imgsArragenTopArr[0]);
        }
         //塞回中间部分的信息
         imgsArragenArr.splice(centerIndex,0,imgsArrangenCenterArr[0]);
        //重新渲染Conponent
         this.setState({
            imgsArragenArr:imgsArragenArr
         });
     }
    /*
     //利用rearrange函数，居中对应index的图片
     @param index需要被居中的图片对应的图片信息数组的index值
     return {function}
     */
    center(index){
      return()=>{
          this.rearragen(index);

      }
    }
    //组件加载以后对每张图片加载范围
    componentDidMount(){
  //拿到舞台大小
       var stageDOM =ReactDOM.findDOMNode(this.refs.stage),
           stageW = stageDOM.scrollWidth,
           stageH = stageDOM.scrollHeight,
           halfStageW = Math.ceil(stageW / 2),
           halfStageH = Math.ceil(stageH / 2);
//拿到一个imgfigure的大小
      var imgFigureDOM= ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);
        //计算中心图片的位置
        this.Constant.centerPos={
            left : halfStageW - halfImgW,
            top　:halfStageH - halfImgH
         };
        //计算左侧和右侧位置点取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //上侧区域的位置点取值范围
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.rearragen(0);

    }

    //定义产量
    render() {
      var conterllerUnits =[],
           imgFigures =[];
      imageDatas.forEach((value,index)=> {
          //如果没有绑定imgsArragenArr对象则给其赋初始值
          if (!this .state.imgsArragenArr[index]){
              this.state.imgsArragenArr[index]={
                  pos:{
                      left:0 ,
                      top :0
                  },
                  rotate : 0, //填充旋转角度
                  isInverse : false,
                  isCenter : false
              };
          }
          imgFigures.push(<ImgFigur data={value} key={index} ref={'imgFigure'+index} arrange ={this.state.imgsArragenArr[index]} inverse={this.inverse(index)}
           center={this.center(index)}/>);

          conterllerUnits.push(<ControllerUnit
               key={index}
               arrange ={this.state.imgsArragenArr[index]}
               inverse ={this.inverse(index)}
               center ={this.center(index)}
           />);
      });
    return (
        //搭建舞台sesion(部件块的意思)
        <section className="stage" ref="stage">
            <section className="image-sec">
                 {imgFigures}
                {}
            </section>
            <nav className="controller-nav">
                 {conterllerUnits}
            </nav>
        </section>
    );
  }
}
AppComponent.defaultProps = {
};
export default AppComponent;
