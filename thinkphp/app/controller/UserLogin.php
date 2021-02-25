<?php
declare (strict_types = 1);

namespace app\controller;

use app\model\Article;
use think\Exception;
use think\Request;
use think\facade\Db;
use think\facade\Filesystem;
use app\model\Author;

class UserLogin
{
    /*
     * 用户登录
     *  */
    public function login()
    {
        $res = request();
        $result = Author::where(
            [
                ["account","=",$res->param('account')],
                ["password","=",$res->param('password')]
            ]
        )->select();
        return $result->visible(['id','username','account','img','sex','auth']);
    }
    /*
     * 修改个人信息
     * */
    public function editMyData(){
        global $upD;
        $upD = json_decode(request()->param("data"),true);
        try {
            $resultModel = Db::transaction(function(){
                //如果有图片
                if(request()->file()!== null){
                    $path =  Filesystem::putFile('replys', request()->file("head"));
                    $GLOBALS["upD"]["img"] = $path;
                }
                //先修改用户信息
                Author::where("account",$GLOBALS["upD"]['account'])->save($GLOBALS["upD"]);
                //获取数据
                $res = Author::where("id",$GLOBALS["upD"]["id"])->select()->toArray()[0];
                //在修改文章对应的数据
                $articlModel = Article::update([
                    'title' => $res["username"],
                    'img' => $res["img"]
                ], ['authorId' => $res["id"]]);
                return $res;
            });
            return $resultModel;
        }catch (Exception $e){
            return -1;
        }
    }
    /*
     * 用户注册
     * */
    public function register(){
        global $postD;
        $postD = request()->param("userMSG");
        $res = Author::where("account",$postD["account"])->select()->count();
        if(!$res){
           $model = new Author();
           $result = $model->save($postD);
           if($result){
               return 200;    //成功
           }else{
               return -1;     //失败
           }
        }else{
            return 500;       //已存在
        }
    }
}
