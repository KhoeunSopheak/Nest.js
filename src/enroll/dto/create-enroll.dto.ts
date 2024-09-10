

export class CreateEnrollDto {
    majorId: number
    studentId: number
    selectedCourse: {
        courseId: number
    }[]
}
