<?php
declare (strict_types = 1);

namespace app\controller;

use think\Request;
use app\model\Types;

class GetTypes
{
    /**
     * 输出所有类型列表
     *
     * @return \think\Response
     */
    public function index($lmt,$wh="")
    {
        //默认一页显示15个
         $data = Types::when($wh,function ($query) use ($wh){
            $query->where('typeValue','like','%'.$wh.'%');
         })->limit($lmt*15,15)->select()->toArray();
//         dump($data);
        return $data;
    }

    /**
     * 显示创建资源表单页.
     *
     * @return \think\Response
     */
    public function create()
    {
        //
    }

    /**
     * 保存新建的资源
     * 创建新的类型
     */
    public function save(Request $request)
    {
       //先查看是否存在
       $isset = Types::where("typeValue",$request->param("typeValue"))->select()->count();
       if($isset == 0){
           $result = Types::insert($request->param());
           return $result;
       }else{
           return "类型已存在";
       }
    }

    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read($id)
    {
        //
    }

    /**
     * 显示编辑资源表单页.
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * 保存更新的资源
     *
     * @param  \think\Request  $request
     * @param  int  $id
     * @return \think\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * 删除指定资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function delete($id)
    {
        //
    }
}
