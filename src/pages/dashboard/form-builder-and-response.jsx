import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Copy, Image, Mail } from 'lucide-react';
import { Service } from '@/data/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export function Formulario() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async () => {
    try {
      const cuestionario = await Service.post('/cuestionario/', {
        nombre: title,
        descripcion: description,
        usuario: Cookies.get('user')
      });
  
      if (cuestionario) {
        const preguntas = await Promise.all(questions.map(async (q, index) => {
          
          const preguntaData = {
            cuestionario: cuestionario.id,
            texto: q.question,
            tipo: q.type,
            opciones: q.type === "seleccion multiple" ? q.options : {}
          };
  
          const pregunta = await Service.post('/pregunta/', preguntaData);
          
          return pregunta;
        }));
        
        Swal.fire({
          icon: 'success',
          title: 'Cuestionario guardado',
          text: 'El cuestionario ha sido guardado correctamente.'
        });
      }
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar cuestionario:',
        text: error
      });
    }
  };
  

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'seleccion multiple',
      question: '',
      options: ['']
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...(q.options || []), ''] } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.map((opt, index) => 
          index === optionIndex ? value : opt
        )
      } : q
    ));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'respuesta corta':
        return <Input disabled placeholder="Texto de respuesta corta" className="mt-2 bg-gray-100" />;
      case 'seleccion multiple':
        return (
          <RadioGroup className="space-y-2 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={`option-${index}`} id={`option-${question.id}-${index}`} />
                <Input
                  value={option}
                  onChange={(e) => updateOption(question.id, index, e.target.value)}
                  className="flex-1"
                  placeholder={`Opción ${index + 1}`}
                />
              </div>
            ))}
          </RadioGroup>
        );
      case 'respuesta larga':
        return <Textarea disabled placeholder="Texto de respuesta larga" className="min-h-[100px] mt-2 bg-gray-100" />
      case 'verdadero falso':
        return (
          <RadioGroup className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`true-${question.id}`} />
              <Label htmlFor={`true-${question.id}`}>Verdadero</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`false-${question.id}`} />
              <Label htmlFor={`false-${question.id}`}>Falso</Label>
            </div>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl mt-6">
<div className="container mx-auto p-4 rounded-">
          {/* Header with SENA logo */}
        <div className="flex items-center space-x-3 mb-8">
          <img src="/public/img/logoSena.jpg" alt="Logo SENA" className="h-12 w-12 rounded-full" />
          <span className="text-2xl font-bold text-green-600">AutoGestion CIES - Formularios</span>
        </div>

        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Preguntas</TabsTrigger>
            <TabsTrigger value="responses" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Respuestas</TabsTrigger>
          </TabsList>
          <TabsContent value="questions">
            <Card className="mb-4 border-2 ">
              <CardContent className="p-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título del formulario"
                  className="text-2xl font-bold mb-2 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción del formulario"
                  className="w-full border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </CardContent>
            </Card>

            {questions.map((question, index) => (
              <Card key={question.id} className="mb-4 border-2 ">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="relative flex-grow mr-2">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        placeholder={`Pregunta ${index + 1}`}
                        className="text-lg font-semibold pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                    >
                      <SelectTrigger className="w-[180px] border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <SelectValue placeholder="Tipo de pregunta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="respuesta corta">Respuesta corta</SelectItem>
                        <SelectItem value="seleccion multiple">Selección múltiple</SelectItem>
                        <SelectItem value="respuesta larga">Respuesta larga</SelectItem>
                        <SelectItem value="verdadero falso">Verdadero/Falso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {renderQuestionInput(question)}
                  <div className="flex justify-end space-x-2 mt-4">
                    {['seleccion multiple'].includes(question.type) && (
                      <Button variant="outline" size="sm" onClick={() => addOption(question.id)} className=" text-green-600 hover:bg-green-50">
                        <Plus className="w-4 h-4 mr-1" /> Agregar opción
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="border-green-600 text-green-600 hover:bg-green-50">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => deleteQuestion(question.id)} className="border-red-600 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addQuestion} className="w-full  py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Agregar pregunta
            </Button>
            <Button onClick={handleSubmit} className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Guardar cuestionario
            </Button>
          </TabsContent>
          <TabsContent value="responses">
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-gray-600">Contenido de respuestas (por implementar)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Formulario;
