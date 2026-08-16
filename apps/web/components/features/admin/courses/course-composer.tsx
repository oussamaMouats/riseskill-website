"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Category, Course } from "@riseskill/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-courses";
import { useCourseOfferings } from "@/hooks/use-course-offerings";
import { useCourseModules } from "@/hooks/use-course-modules";
import { useCourseTestimonials } from "@/hooks/use-course-testimonials";
import { useCourseFaq } from "@/hooks/use-course-faq";
import { ComposerSection } from "./composer-section";
import { CoursePreview } from "./course-preview";
import { CompletenessChecklist } from "./completeness-checklist";
import { OfferingsEditor } from "./offerings-editor";
import { ProgrammeEditor } from "./programme-editor";
import { TestimonialsEditor } from "./testimonials-editor";
import { FaqEditor } from "./faq-editor";
import { ImageUpload } from "../image-upload";

const courseFormSchema = z.object({
  slug: z.string().min(1, "Le slug est requis"),
  title: z.string().min(1, "Le titre est requis"),
  tagline: z.string().optional(),
  description: z.string().min(1, "La description est requise"),
  categoryId: z.string().optional(),
  level: z.string().optional(),
  coverImageUrl: z.string().optional(),
  techStackText: z.string().optional(),
  objectivesText: z.string().optional(),
  published: z.boolean(),
  // --- Page publicitaire ---
  promoHeadline: z.string().optional(),
  promoSubheadline: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  enrolledCountText: z.string().optional(),
  trustBadgesText: z.string().optional(),
  guaranteeText: z.string().optional(),
  urgencyText: z.string().optional(),
  // --- Formateur ---
  instructorName: z.string().optional(),
  instructorTitle: z.string().optional(),
  instructorPhotoUrl: z.string().optional(),
  instructorBio: z.string().optional(),
});
type CourseFormValues = z.infer<typeof courseFormSchema>;

function parseCsv(value?: string) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLines(value?: string) {
  return (value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CourseComposer({
  categories,
  course,
}: {
  categories: Category[];
  course?: Course;
}) {
  const router = useRouter();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse(course?.id ?? "");
  const mutation = course ? updateCourse : createCourse;

  const { data: offerings } = useCourseOfferings(course?.id ?? "");
  const { data: modules } = useCourseModules(course?.id ?? "");
  const { data: testimonials } = useCourseTestimonials(course?.id ?? "");
  const { data: faqItems } = useCourseFaq(course?.id ?? "");

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      slug: course?.slug ?? "",
      title: course?.title ?? "",
      tagline: course?.tagline ?? "",
      description: course?.description ?? "",
      categoryId: course?.categoryId ?? undefined,
      level: course?.level ?? "",
      coverImageUrl: course?.coverImageUrl ?? "",
      techStackText: course?.techStack.join(", ") ?? "",
      objectivesText: course?.objectives.join("\n") ?? "",
      published: course?.published ?? false,
      promoHeadline: course?.promoHeadline ?? "",
      promoSubheadline: course?.promoSubheadline ?? "",
      heroVideoUrl: course?.heroVideoUrl ?? "",
      enrolledCountText: course?.enrolledCount != null ? String(course.enrolledCount) : "",
      trustBadgesText: course?.trustBadges.join(", ") ?? "",
      guaranteeText: course?.guaranteeText ?? "",
      urgencyText: course?.urgencyText ?? "",
      instructorName: course?.instructorName ?? "",
      instructorTitle: course?.instructorTitle ?? "",
      instructorPhotoUrl: course?.instructorPhotoUrl ?? "",
      instructorBio: course?.instructorBio ?? "",
    },
  });

  const watched = useWatch({ control: form.control });

  function onSubmit(values: CourseFormValues) {
    const { techStackText, objectivesText, enrolledCountText, trustBadgesText, ...rest } = values;
    const payload = {
      ...rest,
      coverImageUrl: rest.coverImageUrl || undefined,
      heroVideoUrl: rest.heroVideoUrl || undefined,
      instructorPhotoUrl: rest.instructorPhotoUrl || undefined,
      techStack: parseCsv(techStackText),
      objectives: parseLines(objectivesText),
      trustBadges: parseCsv(trustBadgesText),
      enrolledCount: enrolledCountText ? Number(enrolledCountText) : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: (saved) => {
        if (course) {
          toast.success("Formation mise à jour.");
          router.refresh();
        } else {
          toast.success("Formation créée — ajoutez maintenant les tarifs et le programme.");
          router.push(`/admin/courses/${saved.id}/edit`);
        }
      },
      onError: () => toast.error("Vérifiez les informations saisies (slug déjà utilisé ?)."),
    });
  }

  const objectivesCount = parseLines(watched.objectivesText).length;
  const checklistItems = [
    { label: "Image de couverture", done: !!watched.coverImageUrl },
    {
      label: "Description convaincante (min. 80 caractères)",
      done: (watched.description?.length ?? 0) >= 80,
    },
    { label: "Au moins un objectif", done: objectivesCount > 0 },
    { label: "Au moins une offre tarifée", done: !!offerings?.length },
    { label: "Programme (au moins un module)", done: !!modules?.length },
    { label: "Accroche publicitaire renseignée", done: !!watched.promoHeadline },
    { label: "Formateur renseigné", done: !!watched.instructorName },
    { label: "Au moins un témoignage", done: !!testimonials?.length },
    { label: "Au moins une question FAQ", done: !!faqItems?.length },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ComposerSection
              step={1}
              title="Identité"
              description="Ce qui identifie la formation et sa page publique."
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accroche</FormLabel>
                      <FormControl>
                        <Input placeholder="Une phrase qui donne envie de cliquer" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label="Image de couverture"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Aucune" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau</FormLabel>
                        <FormControl>
                          <Input placeholder="Débutant, Intermédiaire..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ComposerSection>

            <ComposerSection
              step={2}
              title="Page publicitaire"
              description="L'accroche, la preuve sociale et l'urgence qui font convertir une visite venue d'une publicité."
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="promoHeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accroche (headline)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Devenez développeur web en 4 mois" {...field} />
                      </FormControl>
                      <FormDescription>
                        Remplace le titre sur la landing page publicitaire — plus percutant, orienté
                        résultat.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promoSubheadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sous-accroche</FormLabel>
                      <FormControl>
                        <Input placeholder="Une phrase qui appuie la promesse" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroVideoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vidéo de présentation (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enrolledCountText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d&apos;inscrits (preuve sociale)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="Ex : 250" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trustBadgesText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badges de confiance</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Certificat reconnu, Paiement flexible..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Séparés par des virgules.</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="guaranteeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantie</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Satisfait ou remboursé sous 7 jours" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="urgencyText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgence / places limitées</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex : Prochaine session le 15 septembre — places limitées"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Texte libre affiché près du bouton d&apos;inscription — pas de compte à
                        rebours automatique.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </ComposerSection>

            <ComposerSection
              step={3}
              title="Tarifs & formats"
              description="Un prix et une durée par format proposé — présentiel, en ligne live ou en ligne autonome."
              locked={
                !course
                  ? "Enregistrez d'abord l'identité de la formation pour ajouter des tarifs."
                  : undefined
              }
            >
              {course && <OfferingsEditor courseId={course.id} />}
            </ComposerSection>

            <ComposerSection
              step={4}
              title="Contenu"
              description="Ce que la formation couvre et ce qu'on en retire."
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objectivesText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectifs</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormDescription>
                        Un objectif par ligne — ce sont les puces à coche sur la page publique.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="techStackText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies / outils</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Séparés par des virgules.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </ComposerSection>

            <ComposerSection
              step={5}
              title="Programme"
              description="Les modules affichés publiquement ; les leçons ne sont visibles que par les étudiants inscrits en ligne."
              locked={
                !course
                  ? "Enregistrez d'abord l'identité de la formation pour construire le programme."
                  : undefined
              }
            >
              {course && <ProgrammeEditor courseId={course.id} />}
            </ComposerSection>

            <ComposerSection
              step={6}
              title="Formateur"
              description="Renforce la confiance — qui anime la formation."
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instructorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructorTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre / poste</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex : Lead développeur, 8 ans d'expérience"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="instructorPhotoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload label="Photo" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructorBio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio courte</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ComposerSection>

            <ComposerSection
              step={7}
              title="Témoignages"
              description="La preuve sociale — l'élément qui rassure le plus un visiteur venu d'une publicité."
              locked={
                !course
                  ? "Enregistrez d'abord l'identité de la formation pour ajouter des témoignages."
                  : undefined
              }
            >
              {course && <TestimonialsEditor courseId={course.id} />}
            </ComposerSection>

            <ComposerSection
              step={8}
              title="FAQ"
              description="Répondez aux objections avant qu'elles ne fassent fuir un visiteur."
              locked={
                !course
                  ? "Enregistrez d'abord l'identité de la formation pour ajouter des questions."
                  : undefined
              }
            >
              {course && <FaqEditor courseId={course.id} />}
            </ComposerSection>

            <ComposerSection step={9} title="Visibilité">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Publiée (visible sur le site public)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </ComposerSection>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Enregistrement..."
                  : course
                    ? "Enregistrer les modifications"
                    : "Créer la formation"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="space-y-4">
        <CoursePreview values={watched} offerings={offerings ?? []} />
        <CompletenessChecklist items={checklistItems} />
      </div>
    </div>
  );
}
