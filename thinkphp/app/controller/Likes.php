<?php
declare (strict_types = 1);

namespace app\controller;

use League\Flysystem\Exception;
use think\Request;
use think\facade\Db;
use app\model\Article;
use app\model\Likes as likeModel;

class Likes
{
    /**
     * 给帖子点赞
     */
    public function loves($authorId,$articleId)
    {
        //$articleId 要点赞的帖子id
        //$authorId  作者的id
        //判断是否已经存在 用户点击的帖子的
        global $model,$exist,$parall,$ArticleModel;
        //存放条件
        $parall = [
            "authorId"   => $authorId,
            "articleId"  => $articleId
        ];
        $exist = likeModel::withSearch(['Exist'],[
            "authorId" => $authorId,
            "articleId" => $articleId
        ])->select()->count();
        //实例化数据库
        $ArticleModel = Article::where("articleId",$articleId);
        //操作区  开启事务模式
        try {
            Db::transaction(function(){
                //如果没有存在 标识用户没有点赞 $exist == 0  否则标识已经存在,返回false
                if($GLOBALS['exist'] == 0){
                    $GLOBALS['model'] = likeModel::insert($GLOBALS['parall']);
                }else{
                    $GLOBALS['model'] = likeModel::where($GLOBALS['parall'])->delete();
                }
                //获取指定帖子的喜欢量
                $computed = likeModel::scope('LikesCount',$GLOBALS['parall']['articleId'])->select()->count();
                //重置喜欢量
                $GLOBALS['ArticleModel']->save([
                    "loves" => $computed
                ]);
                //执行成功返回true
                return true;
            });
        }catch (Exception $exception){
            //执行失败
            return false;
        }
    }
}
