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
        choiceFail: {
            url: cc.AudioClip,
            default: null
        },

        choiceSuccess: {
            url: cc.AudioClip,
            default: null
        },

        guessChoice: {
            url: cc.AudioClip,
            default: null
        },

        lock: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    play (type) {           //type为0：choiceFail，1：choiceSuccess， 2：guessChoice，3：lock
        var audioID = 0;
        switch(type) {
            case 0:
            audioID = cc.audioEngine.play(this.choiceFail, false, 1);
            break;

            case 1: 
            audioID = cc.audioEngine.play(this.choiceSuccess, false, 1);
            break;

            case 2:
            audioID = cc.audioEngine.play(this.guessChoice, false, 1);
            break;

            case 3:
            audioID = cc.audioEngine.play(this.lock, false, 1);
            break;

            default: 
            break;
        }
    }
});
