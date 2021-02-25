<?php
declare (strict_types = 1);

namespace app\model;
//二级评论对应着 二级评论对应的图片
//图片表
use app\model\Replysimage;
use think\Model;

/**
 * @mixin \think\Model
 */
class Secendreplys extends Model
{
    //开启时间戳
    protected $autoWriteTimestamp = true;
    protected $createTime = 'createTime';
    protected $updateTime = 'updateTime';
    //获取二级评论对应的图片
    public function userContentImg($id=2){
        // $id 标识归属于二级评论
        return $this->hasMany(Replysimage::class,'replysId')->where('vestIn',$id);
    }

    //当二级评论被删除时,自动删除二级评论对应的图片
    public static function onAfterDelete($user)
    {
        //删除二级评论对应的图片
        Replysimage::destroy([
            "replysId" => $user->id,
            "vestIn"   => 2
        ]);
    }
}
