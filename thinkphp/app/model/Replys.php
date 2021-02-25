<?php
declare (strict_types = 1);

namespace app\model;
//二级评论表
use app\model\Secendreplys;
//图片表
use app\model\Replysimage;

use think\Model;

/**
 * @mixin \think\Model
 */
class Replys extends Model
{
    //开启时间戳
    protected $autoWriteTimestamp = true;
    protected $createTime = 'createTime';
    protected $updateTime = 'updatetime';

    //获取一级评论对应的的图片      一对多
    public function userContentImg(){
        return $this->hasMany(Replysimage::class,'replysId');
    }
    //获取当前一级评论的二级评论
    //$id是一级评论的id  通过一级评论的id,搜索出指定多个二级评论
    public function thisReplys(){
        return $this->hasMany(\app\model\Secendreplys::class,'replysId');
    }
    //获取指定帖子的所有一级评论 searchFiledAttr  $value是我们传入的条件的值是一个数组,$data获取了我们所有的条件键值对
    public function searchReplysAttr($query,$value,$data){
        $query->where([
            'articleId'=>$data['articleId']
        ]);
    }
    //获取某条一级评论的所有二级评论数据
    public function searchSenAttr($query,$value,$data){
        $query->where([
            'id'=>$data['id']
        ]);
    }
    //模型事件 当一级评论被删除时  主动删除一级评论对应的二级评论 和二级评论对应的图片
    public static function onAfterDelete($user)
    {
        //二级评论和一级评论对应字段
        //一级评论的id  对应二级评论的replysId  vestIn=1
        //删除一级评论对应的二级评论
        Secendreplys::destroy([
            "replysId" => $user->id
        ]);
        //删除一级评论对应的图片
        Replysimage::destroy([
            "replysId" => $user->id,
            "vestIn"   => 1
        ]);
    }
}
