# Sentiment SaaS - Microservicio de Análisis de Sentimiento

Un componente React/Next.js reutilizable para análisis de sentimiento en español usando IA (Robertuito).

## 🚀 Características

- ✅ **Análisis en tiempo real** con IA especializada en español
- ✅ **Componente reutilizable** para cualquier aplicación web
- ✅ **Soporte para temas** claro y oscuro
- ✅ **Modo compacto** para espacios reducidos
- ✅ **Personalizable** con callbacks y estilos
- ✅ **Responsive** y accesible
- ✅ **Backend FastAPI** con API REST

## 📦 Instalación

```bash
# Clonar el proyecto
git clone <repository-url>
cd sentiment-saas-frontend

# Instalar dependencias
npm install

# Iniciar el frontend
npm run dev
```

## 🔧 Backend

Asegúrate de tener el backend FastAPI corriendo:

```bash
cd /Users/development/Desktop/SharedFolder/Satisfaction
python3 main_simple.py
```

El backend estará disponible en `http://localhost:8000`

## 📚 Uso Básico

### 1. Importación Simple

```tsx
import SentimentAnalyzer from '@/components/SentimentAnalyzer'

export default function MiApp() {
  return (
    <div>
      <h1>Análisis de Sentimiento</h1>
      <SentimentAnalyzer />
    </div>
  )
}
```

### 2. Configuración Personalizada

```tsx
import SentimentAnalyzer from '@/components/SentimentAnalyzer'

export default function MiApp() {
  const handleAnalysis = (result, analysis) => {
    console.log('Resultado:', result)
    console.log('Análisis:', analysis)
    
    // Guardar en base de datos, enviar analytics, etc.
  }

  return (
    <SentimentAnalyzer
      apiUrl="https://tu-api.com"
      onAnalysisComplete={handleAnalysis}
      theme="dark"
      compact={true}
      showOriginalReview={false}
      customStyles={{
        borderRadius: '12px',
        border: '2px solid #3b82f6'
      }}
    />
  )
}
```

## 🎛️ Props Disponibles

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `apiUrl` | `string` | `'http://localhost:8000'` | URL del backend FastAPI |
| `onAnalysisComplete` | `function` | `undefined` | Callback cuando se completa el análisis |
| `theme` | `'light' \| 'dark'` | `'light'` | Tema visual del componente |
| `compact` | `boolean` | `false` | Modo compacto para espacios reducidos |
| `showOriginalReview` | `boolean` | `true` | Mostrar review original en resultados |
| `customStyles` | `CSSProperties` | `{}` | Estilos CSS personalizados |

## 🔄 Callback onAnalysisComplete

```tsx
const handleAnalysisComplete = (result: ReviewResponse, analysis: AnalysisResult) => {
  // result: {
  //   id: number,
  //   review: string,
  //   created_at: string,
  //   sentiment_score: number | null,
  //   sentiment_label: string | null
  // }
  
  // analysis: {
  //   sentiment_score: number,
  //   sentiment_label: string,
  //   confidence: number
  // }
  
  // Ejemplos de uso:
  
  // 1. Guardar en analytics
  analytics.track('sentiment_analysis', {
    sentiment: analysis.sentiment_label,
    confidence: analysis.confidence,
    score: analysis.sentiment_score
  })
  
  // 2. Enviar a base de datos
  await saveToDatabase(result)
  
  // 3. Mostrar notificación
  showNotification(`Análisis completado: ${analysis.sentiment_label}`)
}
```

## 🎨 Ejemplos de Integración

### E-commerce (Reviews de Productos)

```tsx
function ProductReview({ productId }) {
  return (
    <div className="product-review-section">
      <h3>Deja tu opinión</h3>
      <SentimentAnalyzer
        apiUrl="https://api.tienda.com"
        onAnalysisComplete={(result) => {
          // Asociar review con producto
          linkReviewToProduct(result.id, productId)
        }}
        compact={true}
        theme="light"
      />
    </div>
  )
}
```

### Red Social (Publicaciones)

```tsx
function SocialPost({ userId }) {
  return (
    <div className="post-creator">
      <SentimentAnalyzer
        apiUrl="https://api.social.com"
        onAnalysisComplete={(result, analysis) => {
          // Clasificar contenido
          if (analysis.sentiment_label === 'negative') {
            triggerModeration(result)
          }
        }}
        showOriginalReview={false}
        customStyles={{
          backgroundColor: '#f8fafc',
          border: 'none'
        }}
      />
    </div>
  )
}
```

### App de Feedback (Encuestas)

```tsx
function FeedbackForm({ surveyId }) {
  return (
    <div className="feedback-section">
      <h2>¿Qué opinas de nuestro servicio?</h2>
      <SentimentAnalyzer
        apiUrl="https://api.feedback.com"
        onAnalysisComplete={(result, analysis) => {
          // Agregar a resultados de encuesta
          addSurveyResponse(surveyId, {
            sentiment: analysis.sentiment_label,
            confidence: analysis.confidence,
            timestamp: new Date().toISOString()
          })
        }}
        theme="dark"
      />
    </div>
  )
}
```

## 🔗 API del Backend

### POST /reviews

```json
// Request
{
  "review": "Este producto es excelente, muy buena calidad"
}

// Response
{
  "id": 1,
  "review": "Este producto es excelente, muy buena calidad",
  "created_at": "2024-01-01T12:00:00Z",
  "sentiment_score": 0.85,
  "sentiment_label": "positive"
}
```

### GET /reviews/analytics

```json
// Response
{
  "total_reviews": 150,
  "average_sentiment": 0.65,
  "sentiment_distribution": {
    "positive": 90,
    "negative": 20,
    "neutral": 40
  },
  "reviews": [...]
}
```

## 🎯 Casos de Uso

1. **E-commerce**: Análisis de reviews de productos
2. **Redes Sociales**: Moderación automática de contenido
3. **Servicios al Cliente**: Clasificación de tickets de soporte
4. **Investigación de Mercado**: Análisis de encuestas
5. **Educación**: Evaluación de retroalimentación de estudiantes
6. **Salud Mental**: Monitoreo de estado de ánimo en diarios

## 🌍 Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Seguridad

- El componente no maneja datos sensibles directamente
- Configurar CORS en el backend para dominios permitidos
- Usar HTTPS en producción
- Validar y sanitizar inputs en el backend

## 📊 Monitoreo

Integra con tu sistema de analytics:

```tsx
<SentimentAnalyzer
  onAnalysisComplete={(result, analysis) => {
    // Google Analytics
    gtag('event', 'sentiment_analysis', {
      'sentiment': analysis.sentiment_label,
      'confidence': analysis.confidence
    })
    
    // Mixpanel
    mixpanel.track('Sentiment Analysis', {
      'Sentiment': analysis.sentiment_label,
      'Score': analysis.sentiment_score
    })
  }}
/>
```

## 🤝 Contribuciones

1. Fork del proyecto
2. Crear feature branch
3. Submit Pull Request

## 📄 Licencia

MIT License - Libre uso y modificación
# Customer-Satisfaction-Analyzer-Frontend
