<?php
declare (strict_types = 1);

namespace app\model;

use think\Model;

/**
 * @mixin \think\Model
 */
class Allthenews extends Model
{
    protected $autoWriteTimestamp = true;
    protected $createTime = "ctime";
    protected $updateTime = "utime";
    //此模型关联两个表  用户表和文章表
    //用户
    public function GetUser(){
        return $this->hasOne(Author::class,"id","authorId");
    }
    //文章表
    public function GetArticle(){
        return $this->hasOne(Article::class,"articleId","articleId");
    }

}
