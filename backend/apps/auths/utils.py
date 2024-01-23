import random


MAX_ACTIVATION_CODE_SIZE = 32


def get_activation_code(code_len: int):
    digits = '0123456789'
    alfabet = 'ABCDEFGHJKLMNOPQRSTVWXYZ'
    symbols = digits + alfabet
    code = []
    for _ in range(code_len):
        code.append(symbols[random.randint(0, len(symbols) - 1)])

    return ''.join(code)
