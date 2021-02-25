<?php
declare (strict_types = 1);

namespace app\model;

use think\Model;
use think\model\relation\HasMany;

/**
 * @mixin \think\Model
 */
class Article extends Model
{
    //开启模型时间戳,记录我们添加数据的日期
    protected $autoWriteTimestamp = true;
    //自定义模型时间戳的插入字段名和更新字段名
    protected $createTime = "createTime";
    protected $updateTime = "updateTime";
    protected $pk = "articleId";
    //查询出文章对应的类型  多对多
    public function types(){
        return $this->belongsToMany(Types::class,Alloation::class);
    }
    //查询出文章对应的评论  一对多
    public function replys(){
        return $this->hasMany(Replys::class,'articleId');
    }
    //查出指定文章的图片  一对多
    public function articleImgs(){
        return $this->hasMany(Replysimage::class,'replysId','articleId')->where('vestIn',3);
    }
    //查询出文章对应的中间表  一对多
    public function whereTypes(){
        return $this->hasMany(Alloation::class,'article_id','articleId');
    }
    //查询出当前帖子有多少人喜欢
    public function GetLovePeople(){
        return $this->hasMany(Likes::class,"articleId","articleId");
    }
    //查询出指定的文章的 使用scope
    public function scopeCurrent($scope, $current)
    {
        $scope->where('articleId',$current)->find();
    }

    //查询出当前帖子有多少人喜欢
    public function lovesPeops(){
        return $this->belongsTo(Likes::class,'articleId','articleId');
    }
}