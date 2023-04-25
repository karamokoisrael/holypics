import base64


@tf.function
def decode_img_bytes(img):
    img = tf.strings.regex_replace(img, "\+", "-")
    img = tf.strings.regex_replace(img, "\/", "_")
    image = tf.image.decode_jpeg(tf.io.decode_base64(img), channels=3)
    image = tf.image.convert_image_dtype(image, dtype=tf.float32)  # 0-1
    image = tf.image.resize(images=image, size=dimensions)
    return image


class ExportModel(tf.keras.Model):
    def __init__(self, model, model_configs):
        super().__init__(self)
        self.model = model
        self.model_configs = model_configs

    @tf.function(input_signature=[
        tf.TensorSpec(shape=(None,), dtype=tf.string, name="base64")
    ])
    def serving_fn(self, base64):
        #a = np.array([x.lower() if isinstance(x, str) else x for x in arr])
        base64_image = tf.map_fn(lambda x: decode_img_bytes(
            x), base64, fn_output_signature=tf.float32)
        scores = self.model.call(base64_image)
        labels = tf.constant([self.model_configs["class_names"]])
        return {
            'scores': scores,
            'classes': tf.repeat(labels, repeats=tf.shape(scores)[0], axis=0, name=None),
            #             'prediction_threshold': tf.constant(self.model_configs["prediction_threshold"]),
            #             "sensitive_class_indexes": tf.constant(self.model_configs["sensitive_class_indexes"])
        }

    def save(self, export_path):
        sigs = {
            'serving_default': self.serving_fn
        }

        # tf.keras.backend.set_learning_phase(0) # inference only
        tf.saved_model.save(self, export_path, signatures=sigs)
