import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json

suspend fun main() {
    val discordWebhookUrl = "https://discordapp.com/api/webhooks/XXXXXXXXXXXX"
    
     val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }
    
    try {
        val response = client.post(discordWebhookUrl) {
            contentType(ContentType.Application.Json)
            setBody("""{"content": "Hello World! :) "}""")
        }
        println("Status: ${response.status}")
    } finally {
        client.close()
    }
}
