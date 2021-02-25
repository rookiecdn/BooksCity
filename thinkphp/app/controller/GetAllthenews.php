<?php
declare (strict_types = 1);

namespace app\controller;

use app\model\Allthenews;
use think\Request;

class GetAllthenews
{
    /*
     * 当用户点赞  type 0
     * */
    public function Add()
    {
        //接收数据
        $isNew = request()->param();
        //自己点赞不记录
        if($isNew["authorId"]==$isNew["toAuthorId"]){
            return 0;
        }
        //如果点赞消息已经成功一次 也不记录
        $res = Allthenews::where([
            "articleId"=> $isNew["articleId"],
            "authorId" => $isNew["authorId"]
        ])->select()->count();
        if($isNew["comment"]==""){
            if($res!=0){
                return 0;
            }
        }
        $model = new Allthenews();
        $model->save($isNew);
        return $model;
    }
    /*
     * 获取指定用户的消息
     * */
    public function GetMSG(){
        $data = Allthenews::with(['GetUser','GetArticle'])->where([
            "toAuthorId"=>request()->param("toAuthorId")
        ])->order("readed asc,id desc")->select()->toArray();
        return $data;
    }
    /*
     * 当用户点击指定的消息,将未读设置成已读  readed == 1
     * */
    public function SetReaded(){
        $id = request()->param("id");
        $model = Allthenews::find($id);
        $model->readed = 1;
        $model->save();
    }

}
