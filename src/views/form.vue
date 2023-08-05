<template>
    <div class="container">
        <div class="form-box">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="帖子标题" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="所属目录" prop="catalog_opt">
                    <el-cascader :options="catalog_opt" v-model="form.catalog_opt"></el-cascader>
                </el-form-item>
                <el-form-item label="发布者" prop="region">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="小明" label="小明" value="小明"></el-option>
                        <el-option key="小红" label="小红" value="小红"></el-option>
                        <el-option key="小白" label="小白" value="小白"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期时间">
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="date2">
                            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="城市" prop="options">
                    <el-cascader :options="options" v-model="form.options"></el-cascader>
                </el-form-item>
                <el-form-item label="是否公开" prop="delivery">
                    <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="话题标签" prop="type">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="tag1" name="type"></el-checkbox>
                        <el-checkbox label="tag2" name="type"></el-checkbox>
                        <el-checkbox label="tag3" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="点赞" prop="like">
                    <el-input type="number" rows="1" v-model="form.like"></el-input>
                </el-form-item>
                <el-form-item label="点踩" prop="dislike">
                    <el-input type="number" rows="1" v-model="form.dislike"></el-input>
                </el-form-item>
                <el-form-item label="收藏数量" prop="favorite">
                    <el-input type="number" rows="1" v-model="form.favorite"></el-input>
                </el-form-item>
                <el-form-item label="帖子内容" prop="desc">
                    <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(formRef)">表单提交</el-button>
                    <el-button @click="onReset(formRef)">重置表单</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

const options = [
    {
        value: 'shanghai',
        label: '上海市',
        children: [
            {
                value: 'pudong',
                label: '浦东新区',
            },
            {
                value: 'yangpu',
                label: '杨浦区',
            },
            {
                value: 'huangpu',
                label: '黄浦区',
            },
            {
                value: 'xuhui',
                label: '徐汇区',
            },
            {
                value: 'songjiang',
                label: '松江区',
            },
            {
                value: 'putuo',
                label: '普陀区',
            },
            {
                value: 'jingan',
                label: '静安区',
            },
            {
                value: 'qingpu',
                label: '青浦区',
            },
            {
                value: 'jiading',
                label: '嘉定区',
            },
            {
                value: 'chongming',
                label: '崇明区',
            },
            {
                value: 'qita',
                label: '其他',
            },
        ],
    },
    {
        value: 'guangdong',
        label: '广东省',
        children: [
            {
                value: 'guangzhou',
                label: '广州市',
                children: [
                    {
                        value: 'tianhe',
                        label: '天河区',
                    },
                    {
                        value: 'haizhu',
                        label: '海珠区',
                    },
                ],
            },
            {
                value: 'dongguan',
                label: '东莞市',
                children: [
                    {
                        value: 'changan',
                        label: '长安镇',
                    },
                    {
                        value: 'humen',
                        label: '虎门镇',
                    },
                ],
            },
        ],
    },
    {
        value: 'hunan',
        label: '湖南省',
        children: [
            {
                value: 'changsha',
                label: '长沙市',
                children: [
                    {
                        value: 'yuelu',
                        label: '岳麓区',
                    },
                ],
            },
        ],
    },
];

const catalog_opt = [
    {
        value: 'module1',
        label: '板块1',
        children: [
            {
                value: 'type1',
                label: '分类1',
            },
            {
                value: 'type2',
                label: '分类2',
            },
            {
                value: 'type3',
                label: '分类3',
            },
        ],
    },
    {
        value: 'module2',
        label: '板块2',
        children: [
            {
                value: 'type1',
                label: '分类1',
            },
            {
                value: 'type2',
                label: '分类2',
            },
            {
                value: 'type3',
                label: '分类3',
            },
        ],
    },
    {
        value: 'module3',
        label: '板块3',
        children: [
            {
                value: 'type1',
                label: '分类1',
            },
            {
                value: 'type2',
                label: '分类2',
            },
            {
                value: 'type3',
                label: '分类3',
            },
        ],
    },
];

const rules: FormRules = {
    name: [{ required: true, message: '请输入帖子标题', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: true,
    type: ['小明'],
    desc: '',
    like: '',
    dislike: '',
    favorite: '',
    options: [],
    catalog_opt: [],
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log(form);
            ElMessage.success('提交成功！');
        } else {
            return false;
        }
    });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>
