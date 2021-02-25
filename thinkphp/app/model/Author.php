<?php
declare (strict_types = 1);

namespace app\model;

use app\model\Likes;
use think\Model;

/**
 * @mixin \think\Model
 */
class Author extends Model
{
    //开启时间戳
    protected $autoWriteTimestamp = true;
    protected $createTime = "create_time";        //数据添加的时候，create_time 这个字段不自动写入时间戳
    protected $updateTime = "update_time";  //数据更新的时候，update_at 这个字段自动写入时间戳
    protected $visible = [ 'id','username','account','img','sex'];
    //查询当前用户都点赞了那些帖子
    public function FavoritePosts(){
        return $this->hasMany(Likes::class,'authorId','id');
    }
}
#