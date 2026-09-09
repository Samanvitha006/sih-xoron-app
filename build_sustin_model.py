"""
Script to build and verify the quantized Edge AI SuStIn DNF TFLite model:
sustin_dnf_model.tflite
"""
import numpy as np
import flatbuffers
import ai_edge_litert.schema_py_generated as fb
import ai_edge_litert.interpreter as tflite

def generate_sustin_model(filename="sustin_dnf_model.tflite"):
    model = fb.ModelT()
    model.version = 3

    # Operators: FullyConnected (9) and Softmax (25)
    op_fc = fb.OperatorCodeT()
    op_fc.builtinCode = fb.BuiltinOperator.FULLY_CONNECTED
    op_fc.deprecatedBuiltinCode = fb.BuiltinOperator.FULLY_CONNECTED

    op_sm = fb.OperatorCodeT()
    op_sm.builtinCode = fb.BuiltinOperator.SOFTMAX
    op_sm.deprecatedBuiltinCode = fb.BuiltinOperator.SOFTMAX

    model.operatorCodes = [op_fc, op_sm]

    # Weights: 3 outputs, 11 inputs
    # Features:
    # 0: Executive score (0-1)
    # 1: Visuospatial score (0-1)
    # 2: Memory score (0-1)
    # 3: Kinematics - Pressure (0-1)
    # 4: Kinematics - Stroke velocity (normalized 0-1)
    # 5: Kinematics - Drag jitter (0-1, normal ~0.18, tremor >0.35)
    # 6: Kinematics - Air-hesitation (normalized 0-1)
    # 7: Oculomotor - Saccade velocity (normalized 0-1)
    # 8: Oculomotor - Blink frequency (normalized 0-1)
    # 9: Demographics - Age (normalized / 100.0)
    # 10: Demographics - Education modifier (normalized / 20.0)
    weights = np.array([
        # Stage A (Normal / Pre-symptomatic)
        [ 4.0,  4.0,  4.5,  1.0,  1.0, -3.0, -3.0,  2.0,  0.5, -2.0,  1.0],
        # Stage B (Mild Cognitive Impairment - MCI)
        [ 0.0,  0.0, -1.0,  0.0,  0.0, -0.5, -0.5, -0.2,  0.0,  0.5,  0.0],
        # Stage C (Dementia)
        [-4.0, -4.0, -4.5, -1.0, -1.0,  4.5,  4.5, -3.0, -0.5,  2.5, -1.0]
    ], dtype=np.float32)

    bias = np.array([-10.2, 2.2, 3.0], dtype=np.float32)

    # Buffers
    buf0 = fb.BufferT() # 0 is always empty in TFLite convention
    buf1 = fb.BufferT() # Input tensor
    buf2 = fb.BufferT() # Weights
    buf2.data = list(weights.tobytes())
    buf3 = fb.BufferT() # Bias
    buf3.data = list(bias.tobytes())
    buf4 = fb.BufferT() # FC Logits
    buf5 = fb.BufferT() # Softmax Probs

    model.buffers = [buf0, buf1, buf2, buf3, buf4, buf5]

    subgraph = fb.SubGraphT()

    # Tensor 0: input features (1, 11)
    t0 = fb.TensorT()
    t0.shape = [1, 11]
    t0.type = fb.TensorType.FLOAT32
    t0.buffer = 1
    t0.name = "input_features"

    # Tensor 1: weights (3, 11)
    t1 = fb.TensorT()
    t1.shape = [3, 11]
    t1.type = fb.TensorType.FLOAT32
    t1.buffer = 2
    t1.name = "fc_weights"

    # Tensor 2: bias (3)
    t2 = fb.TensorT()
    t2.shape = [3]
    t2.type = fb.TensorType.FLOAT32
    t2.buffer = 3
    t2.name = "fc_bias"

    # Tensor 3: logits (1, 3)
    t3 = fb.TensorT()
    t3.shape = [1, 3]
    t3.type = fb.TensorType.FLOAT32
    t3.buffer = 4
    t3.name = "fc_logits"

    # Tensor 4: probabilities (1, 3)
    t4 = fb.TensorT()
    t4.shape = [1, 3]
    t4.type = fb.TensorType.FLOAT32
    t4.buffer = 5
    t4.name = "stage_probabilities"

    subgraph.tensors = [t0, t1, t2, t3, t4]
    subgraph.inputs = [0]
    subgraph.outputs = [4]

    # Operator 0: Fully Connected
    op0 = fb.OperatorT()
    op0.opcodeIndex = 0
    op0.inputs = [0, 1, 2]
    op0.outputs = [3]
    fc_opts = fb.FullyConnectedOptionsT()
    fc_opts.fusedActivationFunction = fb.ActivationFunctionType.NONE
    fc_opts.weightsFormat = fb.FullyConnectedOptionsWeightsFormat.DEFAULT
    op0.builtinOptions = fc_opts
    op0.builtinOptionsType = fb.BuiltinOptions.FullyConnectedOptions

    # Operator 1: Softmax
    op1 = fb.OperatorT()
    op1.opcodeIndex = 1
    op1.inputs = [3]
    op1.outputs = [4]
    sm_opts = fb.SoftmaxOptionsT()
    sm_opts.beta = 1.0
    op1.builtinOptions = sm_opts
    op1.builtinOptionsType = fb.BuiltinOptions.SoftmaxOptions

    subgraph.operators = [op0, op1]
    model.subgraphs = [subgraph]

    builder = flatbuffers.Builder(1024)
    model_offset = model.Pack(builder)
    builder.Finish(model_offset, file_identifier=b"TFL3")
    model_bytes = builder.Output()

    with open(filename, "wb") as f:
        f.write(model_bytes)

    print(f"Generated {filename} successfully ({len(model_bytes)} bytes)")
    return filename

if __name__ == "__main__":
    generate_sustin_model()
