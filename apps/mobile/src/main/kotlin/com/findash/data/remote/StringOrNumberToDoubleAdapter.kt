package com.findash.data.remote

import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import com.google.gson.stream.JsonWriter

class StringOrNumberToDoubleAdapter : TypeAdapter<Double>() {
    override fun write(out: JsonWriter, value: Double?) {
        if (value == null) {
            out.nullValue()
            return
        }
        out.value(value)
    }

    override fun read(reader: JsonReader): Double {
        return when (reader.peek()) {
            JsonToken.NULL -> {
                reader.nextNull()
                0.0
            }
            JsonToken.NUMBER -> reader.nextDouble()
            JsonToken.STRING -> reader.nextString().toDoubleOrNull() ?: 0.0
            else -> {
                reader.skipValue()
                0.0
            }
        }
    }
}

