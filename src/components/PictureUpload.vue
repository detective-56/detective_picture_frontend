<template>
  <a-upload
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :custom-request="handleUpload"
    :before-upload="beforeUpload"
  >
    <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">点击或拖拽上传图片</div>
    </div>
  </a-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { getPictureVoByIdUsingGet, uploadUsingPost } from '@/service/api/pictureController'
import { useRoute } from 'vue-router'

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const handleUpload = async ({file} : any) => {
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await uploadUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.message) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败, ' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  const isLt2M = file.size / 1024 /1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }
  return isJpgOrPng && isLt2M;
};

interface Props {
  picture?: API.PictureVo
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>()

</script>
<style scoped>

.picture-upload :deep(.ant-upload) {
  width: 100%;
  height: 100%;
  min-height: 152px;
  min-width: 152px;
}
.picture-upload img {
  max-width: 100%;
  max-height: 400px;
}

.ant-upload-select-picture-card {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 32px;
  color: #999;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
