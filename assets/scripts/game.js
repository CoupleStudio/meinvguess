// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        videoPlayer: {
            default: null,
            type: cc.VideoPlayer,
        }, 

        guessAnim: {
            default: null,
            type: cc.Animation,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.log("haha");
    },

    // update (dt) {},

    videoPlayerEvent (sender, event) {
        if(event === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            this.videoPlayer.play();
        } else if(event === cc.VideoPlayer.EventType.COMPLETED) {
            this.playGuessAnim();
        }
        // else if(event === cc.VideoPlayer.EventType.CLICKED) {
        //     this.videoPlayer.node.removeFromParent();
        //     this.title.enabled = true;
        // }
    },

    playGuessAnim () {

        var animation = this.guessAnim;
        animation.node.active = !animation.node.active;
        cc.log('debug0');
        
        cc.log(animation);
        cc.loader.loadRes("textures/guessAnim", cc.SpriteAtlas, (err, atlas) => {
            var spriteFrames = atlas.getSpriteFrames();
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
            clip.name = 'guess';
            clip.wrapMode = cc.WrapMode.Loop;
       
            animation.addClip(clip);
            animation.play('guess');
        });
    }


});
