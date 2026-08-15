export default function CoursePlayerPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Lecture de la formation</h2>
      {/* TODO: fetch modules/lessons + progress for this courseId once wired up */}
      <p className="text-slate-600">Formation : {params.courseId}</p>
    </div>
  );
}
