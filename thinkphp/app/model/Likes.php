<?php
declare (strict_types = 1);

namespace app\model;

use think\Model;

/**
 * @mixin \think\Model
 */
class Likes extends Model
{
    //输出白名单
    protected $visible = ['articleId'];
    //判断指定数据是否存在
    public function searchExistAttr($query,$value,$data){
        $query->where([
           "authorId"  =>  $data['authorId'],
           "articleId" =>  $data['articleId']
        ]);
    }
    //判断数据
    public function scopeLikesCount($query,$value){
        $query->where("articleId",$value);
    }
}
