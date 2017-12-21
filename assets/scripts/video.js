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
        videoPlayer: cc.VideoPlayer
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.log('video===');
        cc.log(this.videoPlayer);
    },

    // update (dt) {},

    onEventVideoPlayer (sender, event) {
        if(event === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            this.videoPlayer.play();
            return;
        }
        if(event === cc.VideoPlayer.EventType.COMPLETED) {
            var game = this.node.parent.parent.getComponent("game");
            if(game._status == 1) {
                game.playGuessAnim();
                game.myGuess.active = true;
                return;
            }

            if(game._status == 2) {     //输
                game._blood--;
                if(game._blood <= 0) {
                    game._blood = 0;
                }
                cc.sys.localStorage.setItem("blood", game._blood);
                game.refreshGame();
                return;
            }
            if(game._status == 0) {     //赢
                game._level++;
                if(game._level >=6) {
                    game._level = 6;
                }
                cc.sys.localStorage.setItem("level", game._level);
                game.refreshGame();
                return;
            }

            return;
        }
    }
});
